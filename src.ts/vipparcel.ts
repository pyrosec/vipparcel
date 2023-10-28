import qs from "querystring";
import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import { mapValues } from "lodash";
import FormData from "form-data";
import url from "url";

export const objectToProxyString = (o: any) => {
  return 'socks5://' + (o.userId ? o.userId + ':' + o.password + '@' : '') + o.hostname + (o.port ? ':' + o.port : '');
};

export class VIPParcel {
  public static API_URL = "https://vipparcel.com/api/v1";
  public authToken: string;
  public proxyOptions: any;
  constructor() {
    this.authToken = process.env.VIPPARCEL_API_KEY;
  }
  static fromObject(o: any) {
    return new this();
  }
  toObject() {
    return { authToken: this.authToken };
  }
  static fromJSON(s: string) {
    return this.fromObject(JSON.parse(s));
  }
  toJSON() {
    return JSON.stringify(this.toObject(), null, 2);
  }
  _makeAgent() {
    if (!this.proxyOptions) return null;
    const parsed = url.parse(this.proxyOptions);
    if (parsed.protocol === 'http:') return new HttpsProxyAgent(this.proxyOptions);
    else if (parsed.protocol === 'socks5:') return new SocksProxyAgent(this.proxyOptions);
    else throw Error('unsupported proxy protocol: ' + parsed.protocol);
  }
  async _call(uri, config) {
    const body = JSON.parse(config.body || "{}");
    const entries = Object.entries(body);
    if (config.method === 'GET')
      uri += "?" + qs.stringify({ authToken: this.authToken });
    else {
      body.authToken = this.authToken;
      config.body = new URLSearchParams(body);
      config.headers = config.headers || {};
      config.headers['content-type'] = 'application/x-www-form-urlencoded';
    }
    uri = (this.constructor as any).API_URL + uri;
    const agent = this._makeAgent();
    if (agent) config.agent = agent;
    return await (await fetch(uri, config)).json();
  }
  async ipinfo() {
    return await (await fetch('https://ipinfo.io/json', { agent: this._makeAgent(), method: 'GET' })).json();
  }
  async shippingLabelGetInfo(o: { id: string; }) {
    return await this._call("/shipping/label/getInfo/" + o.id, {
      method: "GET",
    });
  }
  async shippingLabelEdit(o: {
    id: string;
    toAddress: string;
    weightLbs: number;
    weightOz: number;
    length: number;
    width: number;
    height: number;
  }) {
    const body = { to_address: o.toAddress, weight_lbs: o.weightLbs, weight_oz: o.weightOz, length: o.length, width: o.width, height: o.height };
    return await this._call("/shipping/label/edit/" + o.id, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  async shippingLabelGetImages(o: { id: string; }) {
    return await this._call("/shipping/label/getImages/" + o.id, {
      method: "GET",
    });
  }
  async shippingLabelGetList(o: {
    limit: number;
    offset: number;
    orderBy: string[];
    authToken: string;
    optionalFields: string[];
  }) {
    return await this._call("/shipping/label/getList", { method: "GET", body: JSON.stringify(o)});
  }
  async shippingLabelMailClasses(o: any) {
    return await this._call("/shipping/label/mailClasses", { method: "GET" });
  }
  async shippingLabelCalculate(o: {
    labelType: string;
    mailClass: string;
    weightOz: number;
    deliveryConfirmation: string;
    insuredValue: number;
    senderPostalCode: string;
    recipientPostalCode: string;
    countryId: number;
    length: number;
    height: number;
    width: number;
  }) {
    const body = { labelType: o.labelType, mailClass: o.mailClass, weightOz: o.weightOz, deliveryConfirmation: o.deliveryConfirmation, insuredValue: o.insuredValue, senderPostalCode: o.senderPostalCode, recipientPostalCode: o.recipientPostalCode, countryId: o.countryId, 'dimensionalWeight[length]': o.length, 'dimensionalWeight[height]': o.height, 'dimensionalWeight[width]': o.width };
    return await this._call("/shipping/label/calculate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingLabelCalculateAll(o: {
    authToken: string;
    labelType: string;
    mailClass: string;
    weightOz: number;
    deliveryConfirmation: string;
    insuredValue: number;
    senderPostalCode: string;
    recipientPostalCode: string;
    countryId: number;
    length: number;
    height: number;
    width: number;
  }) {
    const body = { labelType: o.labelType, mailClass: o.mailClass, weightOz: o.weightOz, deliveryConfirmation: o.deliveryConfirmation, insuredValue: o.insuredValue, senderPostalCode: o.senderPostalCode, recipientPostalCode: o.recipientPostalCode, countryId: o.countryId, 'dimensionalWeight[length]': o.length, 'dimensionalWeight[height]': o.height, 'dimensionalWeight[width]': o.width };
    return await this._call("/shipping/label/calculateAll", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingLabelPrint(o: {
    labelType: string;
    mailClass: string;
    weightOz: number;
    description: string;
    deliveryConfirmation: string;
    shipDate: string;
    isApoFpo: any;
    militaryState: string;
    typeOfService: string;
    senderStreetAddress: string;
    senderCity: string;
    senderFirstName: string;
    senderLastName: string;
    senderPhone: string;
    senderPostalCode: string;
    senderState: string;
    senderEmail: string;
    senderCompany: string;
    senderOriginZipCode: string;
    recipientCountryId: string;
    recipientCity: string;
    recipientFirstName: string;
    recipientLastName: string;
    recipientPostalCode: string;
    recipientZip4: string;
    recipientState: string;
    recipientProvince: string;
    recipientPhone: string;
    recipientEmail: string;
    recipientCompany: string;
    recipientStreetAddress: string;
    insuredValue: string;
    eelPfc: string;
    contentsExplanation: string;
    category: string;
    taxId: string;
    customsItem: any[];
    length: number;
    height: number;
    width: number;
    rubberStamp1: string;
    rubberStamp2: string;
    rubberStamp3: string;
    imageFormat: string;
    imageResolution: string;
    validationAddress: boolean;
    reference: string;
  }) {
    const body = {
      labelType: o.labelType,
      mailClass: o.mailClass,
      weightOz: o.weightOz,
      description: o.description,
      deliveryConfirmation: o.deliveryConfirmation,
      shipDate: o.shipDate,
      is_apo_fpo: o.isApoFpo === 'true' || o.isApoFpo === true,
      military_state: o.militaryState,
      type_of_service: o.typeOfService,
      'sender[streetAddress]': o.senderStreetAddress,
      'sender[city]': o.senderCity,
      'sender[firstName]': o.senderFirstName,
      'sender[lastName]': o.senderLastName,
      'sender[phone]': o.senderPhone,
      'sender[postalCode]': o.senderPostalCode,
      'sender[state]': o.senderState,
      'sender[email]': o.senderEmail,
      'sender[company]': o.senderCompany,
      'sender[originZipCode]': o.senderOriginZipCode,
      'recipient[countryId]': o.recipientCountryId,
      'recipient[city]': o.recipientCity,
      'recipient[firstName]': o.recipientFirstName,
      'recipient[lastName]': o.recipientLastName,
      'recipient[postalCode]': o.recipientPostalCode,
      'recipient[zip4]': o.recipientZip4,
      'recipient[state]': o.recipientState,
      'recipient[province]': o.recipientProvince,
      'recipient[phone]': o.recipientPhone,
      'recipient[email]': o.recipientEmail,
      'recipient[company]': o.recipientCompany,
      'recipient[streetAddress]': o.recipientStreetAddress,
      insuredValue: o.insuredValue,
      'dimensionalInfo[height]': Number(o.height),
      'dimensionalInfo[length]': Number(o.length),
      'dimensionalInfo[width]': Number(o.width),
      rubberStamp1: o.rubberStamp1,
      rubberStamp2: o.rubberStamp2,
      rubberStamp3: o.rubberStamp3,
      imageFormat: o.imageFormat,
      imageResolution: o.imageResolution,
      validationAddress: o.validationAddress,
      reference: o.reference
    };
    return await this._call("/shipping/label/print", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingPickupGetInfo(o: { id: string; }) {
    return await this._call("/shipping/pickup/getInfo/" + o.id, {
      method: "GET",
    });
  }
  async shippingPickupGetLabels(o: {
    limit: number;
    offset: number;
    orderBy: string[];
  }) {
    const body = { ...o };
    return await this._call("/shipping/pickup/getLabels", { method: "GET", body: JSON.stringify(body) });
  }
  async shippingPickupGetList(o: {
    limit: number;
    offset: number;
    orderBy: string[];
  }) {
    const body = { ...o };
    return await this._call("/shipping/pickup/getList", { method: "GET", body: JSON.stringify(body) });
  }
  async shippingPickupRequest(o: {
    address: any;
    firstName: string;
    lastName: string;
    state: string;
    city: string;
    zip5: string;
    zip4: string;
    phone: string;
    packages: string[];
    packageLocation: string;
    specialInstructions: string;
  }) {
    const body = { ...o };
    const packages = body.packages;
    delete body.packages;
    packages.forEach((v, i) => {
      body['packages[' + i + ']'] = v;
    });
    return await this._call("/shipping/pickup/request", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingTrackingGetInfo(o: { trackNumber: string }) {
    const body = { ...o };
    return await this._call("/shipping/tracking/getInfo", { method: "GET", body: JSON.stringify(body) });
  }
  async shippingRefundGetInfo(o: { id: string; }) {
    return await this._call("/shipping/refund/getInfo/" + o.id, {
      method: "GET",
    });
  }
  async shippingRefundGetLabels(o: {
    limit: number;
    offset: number;
    orderBy: string[];
  }) {
    const body = { ...o };
    const orderBy = o.orderBy;
    delete body.orderBy;
    (orderBy || []).forEach((v, i) => {
      body['orderBy[' + i + ']'] = v;
    });
    return await this._call("/shipping/refund/getLabels", { method: "GET", body: JSON.stringify(body) });
  }
  async shippingRefundGetList(o: {
    limit: number;
    offset: number;
    orderBy: string[];
  }) {
    const body = { ...o };
    const orderBy = o.orderBy;
    delete body.orderBy;
    (orderBy || []).forEach((v, i) => {
      body['orderBy[' + i + ']'] = v;
    });
    return await this._call("/shipping/refund/getList", { method: "GET", body: JSON.stringify(body) });
  }
  async shippingRefundRequest(o: {
    refundLabels: string[];
    reason: string;
  }) {
    const body = { ...o };
    const refundLabels = o.refundLabels;
    delete body.refundLabels;
    (refundLabels || []).forEach((v, i) => {
      body['refundLabels[' + i + ']'] = v;
    });
    return await this._call("/shipping/refund/request", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingScanFormCreate(o: {
    authToken: string;
    labels: string[];
    address: any;
    firstName: string;
    lastName: string;
    city: string;
    state: string;
    postalCode: string;
  }) {
    const body = { ...o };
    return await this._call("/shipping/scanForm/create", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async shippingScanFormGetLabels(o: { authToken: string }) {
    const body = { ...o };
    return await this._call("/shipping/scanForm/getLabels", { method: "GET" });
  }
  async shippingScanFormGetInfo(o: { id: string; authToken: string }) {
    const body = { ...o };
    delete body.id;
    return await this._call("/shipping/scanForm/getInfo/" + o.id, {
      method: "GET",
    });
  }
  async shippingScanFormGetList(o: { authToken: string }) {
    const body = { ...o };
    return await this._call("/shipping/scanForm/getList", { method: "GET" });
  }
  async accountBalanceGetHistory(o: {
    limit: number;
    offset: number;
    orderBy: string[];
    authToken: string;
  }) {
    const body = { ...o };
    return await this._call("/account/balance/getHistory", { method: "GET" });
  }
  async accountBalanceGetCurrent(o: { authToken: string }) {
    const body = { ...o };
    return await this._call("/account/balance/getCurrent", { method: "GET" });
  }
  async accountAddressGetInfo(o: { id: string; authToken: string }) {
    const body = { ...o };
    delete body.id;
    return await this._call("/account/address/getInfo/" + o.id, {
      method: "GET",
    });
  }
  async accountAddressGetList(o: {
    limit: number;
    offset: number;
    orderBy: string[];
    authToken: string;
  }) {
    const body = { ...o };
    return await this._call("/account/address/getList", { method: "GET" });
  }
  async accountAddressCreate(o: {
    addressType: string;
    firstName: string;
    lastName: string;
    company_name: string;
    state: string;
    city: string;
    postalCode: string;
    address: string;
    phone: string;
    email: string;
    locationType: string;
    countryId: number;
    authToken: string;
  }) {
    const body = { ...o };
    return await this._call("/account/address/create", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async accountAddressDelete(o: { id: string; authToken: string }) {
    const body = { ...o };
    delete body.id;
    return await this._call("/account/address/delete/" + o.id, {
      method: "DELETE",
      body: JSON.stringify(body),
    });
  }
  async accountAddressUpdate(o: {
    id: string;
    addressType: string;
    firstName: string;
    company_name: string;
    lastName: string;
    state: string;
    city: string;
    postalCode: string;
    address: string;
    phone: string;
    email: string;
    locationType: string;
    countryId: number;
    authToken: string;
  }) {
    const body = { ...o };
    delete body.id;
    return await this._call("/account/address/update/" + o.id, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  async accountPersonalInfoDetails(o: { authToken: string }) {
    const body = { ...o };
    return await this._call("/account/personalInfo/details", { method: "GET" });
  }
  async accountPersonalInfoUpdate(o: {
    firstName: string;
    lastName: string;
    state: string;
    city: string;
    postalCode: string;
    streetAddress1: string;
    streetAddress2: string;
    driverLicence: string;
  }) {
    const body = { ...o };
    return await this._call("/account/personalInfo/update", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  async locationCountryGetList(o: { authToken: string }) {
    const body = { ...o };
    return await this._call("/location/country/getList", { method: "GET" });
  }
  async locationStateGetList(o: { authToken: string; military: boolean }) {
    const body = { ...o };
    return await this._call("/location/state/getList", { method: "GET" });
  }
}
