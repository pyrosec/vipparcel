"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VIPParcel = exports.objectToProxyString = void 0;
const querystring_1 = __importDefault(require("querystring"));
const socks_proxy_agent_1 = require("socks-proxy-agent");
const https_proxy_agent_1 = require("https-proxy-agent");
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = __importDefault(require("url"));
const objectToProxyString = (o) => {
    return ("socks5://" +
        (o.userId ? o.userId + ":" + o.password + "@" : "") +
        o.hostname +
        (o.port ? ":" + o.port : ""));
};
exports.objectToProxyString = objectToProxyString;
class VIPParcel {
    constructor() {
        this.authToken = process.env.VIPPARCEL_API_KEY;
    }
    static fromObject(o) {
        return new this();
    }
    toObject() {
        return { authToken: this.authToken };
    }
    static fromJSON(s) {
        return this.fromObject(JSON.parse(s));
    }
    toJSON() {
        return JSON.stringify(this.toObject(), null, 2);
    }
    _makeAgent() {
        if (!this.proxyOptions)
            return null;
        const parsed = url_1.default.parse(this.proxyOptions);
        if (parsed.protocol === "http:")
            return new https_proxy_agent_1.HttpsProxyAgent(this.proxyOptions);
        else if (parsed.protocol === "socks5:")
            return new socks_proxy_agent_1.SocksProxyAgent(this.proxyOptions);
        else
            throw Error("unsupported proxy protocol: " + parsed.protocol);
    }
    async _call(uri, config) {
        const body = JSON.parse(config.body || "{}");
        const entries = Object.entries(body);
        if (config.method === "GET") {
            uri += "?" + querystring_1.default.stringify({ ...body, authToken: this.authToken });
            delete config.body;
        }
        else {
            body.authToken = this.authToken;
            config.body = querystring_1.default.stringify(body).replace(/([a-zA-Z]+)=true/g, '$1').replace(/[a-zA-Z]+=false/, '');
            config.headers = config.headers || {};
            config.headers["content-type"] = "application/x-www-form-urlencoded";
        }
        uri = this.constructor.API_URL + uri;
        const agent = this._makeAgent();
        if (agent)
            config.agent = agent;
        return await (await (0, node_fetch_1.default)(uri, config)).json();
    }
    async ipinfo() {
        return await (await (0, node_fetch_1.default)("https://ipinfo.io/json", {
            agent: this._makeAgent(),
            method: "GET",
        })).json();
    }
    async shippingLabelGetInfo(o) {
        return await this._call("/shipping/label/getInfo/" + o.id, {
            method: "GET",
        });
    }
    async shippingLabelEdit(o) {
        const body = {
            to_address: o.toAddress,
            weight_lbs: o.weightLbs,
            weight_oz: o.weightOz,
            length: o.length,
            width: o.width,
            height: o.height,
        };
        return await this._call("/shipping/label/edit/" + o.id, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }
    async shippingLabelGetImages(o) {
        return await this._call("/shipping/label/getImages/" + o.id, {
            method: "GET",
        });
    }
    async shippingLabelGetList(o) {
        return await this._call("/shipping/label/getList", {
            method: "GET",
            body: JSON.stringify(o),
        });
    }
    async shippingLabelMailClasses(o) {
        return await this._call("/shipping/label/mailClasses", { method: "GET" });
    }
    async shippingLabelCalculate(o) {
        const body = {
            labelType: o.labelType,
            mailClass: o.mailClass,
            weightOz: o.weightOz,
            deliveryConfirmation: o.deliveryConfirmation,
            insuredValue: o.insuredValue,
            senderPostalCode: o.senderPostalCode,
            recipientPostalCode: o.recipientPostalCode,
            countryId: o.countryId,
            "dimensionalWeight[length]": o.length,
            "dimensionalWeight[height]": o.height,
            "dimensionalWeight[width]": o.width,
        };
        return await this._call("/shipping/label/calculate", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingLabelCalculateAll(o) {
        const body = {
            labelType: o.labelType,
            mailClass: o.mailClass,
            weightOz: o.weightOz,
            deliveryConfirmation: o.deliveryConfirmation,
            insuredValue: o.insuredValue,
            senderPostalCode: o.senderPostalCode,
            recipientPostalCode: o.recipientPostalCode,
            countryId: o.countryId,
            "dimensionalWeight[length]": o.length,
            "dimensionalWeight[height]": o.height,
            "dimensionalWeight[width]": o.width,
        };
        return await this._call("/shipping/label/calculateAll", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingLabelPrint(o) {
        const body = {
            labelType: o.labelType,
            mailClass: o.mailClass,
            weightOz: o.weightOz,
            description: o.description,
            deliveryConfirmation: o.deliveryConfirmation,
            shipDate: o.shipDate,
            is_apo_fpo: o.isApoFpo === "true" || o.isApoFpo === true,
            military_state: o.militaryState,
            type_of_service: o.typeOfService,
            "sender[streetAddress]": o.senderStreetAddress,
            "sender[city]": o.senderCity,
            "sender[firstName]": o.senderFirstName,
            "sender[lastName]": o.senderLastName,
            "sender[phone]": o.senderPhone,
            "sender[postalCode]": o.senderPostalCode,
            "sender[state]": o.senderState,
            "sender[email]": o.senderEmail,
            "sender[company]": o.senderCompany,
            "sender[originZipCode]": o.senderOriginZipCode,
            "recipient[countryId]": o.recipientCountryId,
            "recipient[postalCode]": o.recipientPostalCode,
            "recipient[state]": o.recipientState,
            "recipient[city]": o.recipientCity,
            "recipient[firstName]": o.recipientFirstName,
            "recipient[lastName]": o.recipientLastName,
            "recipient[zip4]": o.recipientZip4,
            "recipient[province]": o.recipientProvince,
            "recipient[phone]": o.recipientPhone,
            "recipient[email]": o.recipientEmail,
            "recipient[company]": o.recipientCompany,
            "recipient[streetAddress]": o.recipientStreetAddress,
            insuredValue: o.insuredValue,
            "dimensionalWeight[height]": Number(o.height),
            "dimensionalWeight[length]": Number(o.length),
            "dimensionalWeight[width]": Number(o.width),
            rubberStamp1: o.rubberStamp1,
            rubberStamp2: o.rubberStamp2,
            rubberStamp3: o.rubberStamp3,
            imageFormat: o.imageFormat,
            imageResolution: o.imageResolution,
            validationAddress: o.validationAddress,
            reference: o.reference,
        };
        return await this._call("/shipping/label/print", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingPickupGetLabels(o) {
        const body = { ...o };
        const orderBy = o.orderBy;
        delete body.orderBy;
        (orderBy || []).forEach((v, i) => {
            body["orderBy[" + i + "]"] = v;
        });
        return await this._call("/shipping/pickup/getLabels", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async shippingPickupGetList(o) {
        const body = { ...o };
        const orderBy = o.orderBy;
        delete body.orderBy;
        (orderBy || []).forEach((v, i) => {
            body["orderBy[" + i + "]"] = v;
        });
        return await this._call("/shipping/pickup/getList", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async shippingPickupRequest(o) {
        const body = { ...o };
        const packages = body.packages;
        delete body.packages;
        packages.forEach((v, i) => {
            body["packages[" + i + "]"] = v;
        });
        return await this._call("/shipping/pickup/request", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingTrackingGetInfo(o) {
        const body = { ...o };
        return await this._call("/shipping/tracking/getInfo", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async shippingRefundGetInfo(o) {
        return await this._call("/shipping/refund/getInfo/" + o.id, {
            method: "GET",
        });
    }
    async shippingRefundGetLabels(o) {
        const body = { ...o };
        const orderBy = o.orderBy;
        delete body.orderBy;
        (orderBy || []).forEach((v, i) => {
            body["orderBy[" + i + "]"] = v;
        });
        return await this._call("/shipping/refund/getLabels", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async shippingRefundGetList(o) {
        const body = { ...o };
        const orderBy = o.orderBy;
        delete body.orderBy;
        (orderBy || []).forEach((v, i) => {
            body["orderBy[" + i + "]"] = v;
        });
        return await this._call("/shipping/refund/getList", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async shippingRefundRequest(o) {
        const body = { ...o };
        const refundLabels = o.refundLabels;
        delete body.refundLabels;
        (refundLabels || []).forEach((v, i) => {
            body["refundLabels[" + i + "]"] = v;
        });
        return await this._call("/shipping/refund/request", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingScanFormCreate(o) {
        const body = { ...o };
        delete body.labels;
        const labels = body.labels;
        (labels || []).forEach((v, i) => {
            body["labels[" + i + "]"] = v;
        });
        return await this._call("/shipping/scanForm/create", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async shippingScanFormGetLabels(o) {
        const body = { ...o };
        return await this._call("/shipping/scanForm/getLabels", { method: "GET" });
    }
    async shippingScanFormGetInfo(o) {
        const body = { ...o };
        delete body.id;
        return await this._call("/shipping/scanForm/getInfo/" + o.id, {
            method: "GET",
        });
    }
    async shippingScanFormGetList(o) {
        return await this._call("/shipping/scanForm/getList", { method: "GET" });
    }
    async accountBalanceGetHistory(o) {
        const body = { ...o };
        const orderBy = o.orderBy;
        delete body.orderBy;
        (orderBy || []).forEach((v, i) => {
            body["orderBy[" + i + "]"] = v;
        });
        return await this._call("/account/balance/getHistory", {
            method: "GET",
            body: JSON.stringify(body),
        });
    }
    async accountBalanceGetCurrent(o) {
        return await this._call("/account/balance/getCurrent", { method: "GET" });
    }
    async accountAddressGetInfo(o) {
        return await this._call("/account/address/getInfo/" + o.id, {
            method: "GET",
        });
    }
    async accountAddressGetList(o) {
        const body = { ...o };
        return await this._call("/account/address/getList", { method: "GET" });
    }
    async accountAddressCreate(o) {
        const body = { ...o };
        return await this._call("/account/address/create", {
            method: "POST",
            body: JSON.stringify(body),
        });
    }
    async accountAddressDelete(o) {
        const body = { ...o };
        delete body.id;
        return await this._call("/account/address/delete/" + o.id, {
            method: "DELETE",
            body: JSON.stringify(body),
        });
    }
    async accountAddressUpdate(o) {
        const body = { ...o };
        delete body.id;
        return await this._call("/account/address/update/" + o.id, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }
    async accountPersonalInfoDetails(o) {
        const body = { ...o };
        return await this._call("/account/personalInfo/details", { method: "GET" });
    }
    async accountPersonalInfoUpdate(o) {
        const body = { ...o };
        return await this._call("/account/personalInfo/update", {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }
    async locationCountryGetList(o) {
        const body = { ...o };
        return await this._call("/location/country/getList", { method: "GET" });
    }
    async locationStateGetList(o) {
        const body = { ...o };
        return await this._call("/location/state/getList", { method: "GET" });
    }
}
exports.VIPParcel = VIPParcel;
VIPParcel.API_URL = "https://vipparcel.com/api/v1";
//# sourceMappingURL=vipparcel.js.map