import { SocksProxyAgent } from "socks-proxy-agent";
import { HttpsProxyAgent } from "https-proxy-agent";
export declare const objectToProxyString: (o: any) => string;
export declare class VIPParcel {
    static API_URL: string;
    authToken: string;
    proxyOptions: any;
    constructor();
    static fromObject(o: any): VIPParcel;
    toObject(): {
        authToken: string;
    };
    static fromJSON(s: string): VIPParcel;
    toJSON(): string;
    _makeAgent(): SocksProxyAgent | HttpsProxyAgent<any>;
    _call(uri: any, config: any): Promise<any>;
    ipinfo(): Promise<any>;
    shippingLabelGetInfo(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    shippingLabelEdit(o: {
        id: string;
        authToken: string;
        to_address: string;
        weight_lbs: number;
        weight_oz: number;
        length: number;
        width: number;
        height: number;
    }): Promise<any>;
    shippingLabelGetImages(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    shippingLabelGetList(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
        optionalFields: string[];
    }): Promise<any>;
    shippingLabelMailClasses(o: {
        authToken: string;
    }): Promise<any>;
    shippingLabelCalculate(o: {
        authToken: string;
        labelType: string;
        mailClass: string;
        weightOz: number;
        deliveryConfirmation: string;
        insuredValue: number;
        senderPostalCode: string;
        recipientPostalCode: string;
        countryId: number;
        dimensionalWeight: any[];
        length: number;
        height: number;
        width: number;
    }): Promise<any>;
    shippingLabelCalculateAll(o: {
        authToken: string;
        labelType: string;
        mailClass: string;
        weightOz: number;
        deliveryConfirmation: string;
        insuredValue: number;
        senderPostalCode: string;
        recipientPostalCode: string;
        countryId: number;
        dimensionalWeight: any[];
        length: number;
        height: number;
        width: number;
    }): Promise<any>;
    shippingLabelPrint(o: {
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
    }): Promise<any>;
    shippingPickupGetInfo(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    shippingPickupGetLabels(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    shippingPickupGetList(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    shippingPickupRequest(o: {
        authToken: string;
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
    }): Promise<any>;
    shippingTrackingGetInfo(o: {
        authToken: string;
        trackNumber: string;
    }): Promise<any>;
    shippingRefundGetInfo(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    shippingRefundGetLabels(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    shippingRefundGetList(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    shippingRefundRequest(o: {
        authToken: string;
        refundLabels: string[];
        reason: string;
    }): Promise<any>;
    shippingScanFormCreate(o: {
        authToken: string;
        labels: string[];
        address: any;
        firstName: string;
        lastName: string;
        city: string;
        state: string;
        postalCode: string;
    }): Promise<any>;
    shippingScanFormGetLabels(o: {
        authToken: string;
    }): Promise<any>;
    shippingScanFormGetInfo(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    shippingScanFormGetList(o: {
        authToken: string;
    }): Promise<any>;
    accountBalanceGetHistory(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    accountBalanceGetCurrent(o: {
        authToken: string;
    }): Promise<any>;
    accountAddressGetInfo(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    accountAddressGetList(o: {
        limit: number;
        offset: number;
        orderBy: string[];
        authToken: string;
    }): Promise<any>;
    accountAddressCreate(o: {
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
    }): Promise<any>;
    accountAddressDelete(o: {
        id: string;
        authToken: string;
    }): Promise<any>;
    accountAddressUpdate(o: {
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
    }): Promise<any>;
    accountPersonalInfoDetails(o: {
        authToken: string;
    }): Promise<any>;
    accountPersonalInfoUpdate(o: {
        firstName: string;
        lastName: string;
        state: string;
        city: string;
        postalCode: string;
        streetAddress1: string;
        streetAddress2: string;
        driverLicence: string;
    }): Promise<any>;
    locationCountryGetList(o: {
        authToken: string;
    }): Promise<any>;
    locationStateGetList(o: {
        authToken: string;
        military: boolean;
    }): Promise<any>;
}
