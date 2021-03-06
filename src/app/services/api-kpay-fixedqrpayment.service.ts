/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.13.2.0 (NJsonSchema v10.5.2.0 (Newtonsoft.Json v11.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

import * as moment from 'moment';

export const KPAY_FIXEDQRPAYMENT_API_URL = new InjectionToken<string>('KPAY_FIXEDQRPAYMENT_API_URL');

@Injectable()
export class KpayFixedqrPaymentServiceApiService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(KPAY_FIXEDQRPAYMENT_API_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://api.kpay.com.tr/FixedQRPayment/V1";
    }

    /**
     * Checks service access and returns server date time
     * @return Ok (Service is running and accessible)
     */
    ping(): Observable<PingResultDTO> {
        let url_ = this.baseUrl + "/Ping";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processPing(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processPing(<any>response_);
                } catch (e) {
                    return <Observable<PingResultDTO>><any>_observableThrow(e);
                }
            } else
                return <Observable<PingResultDTO>><any>_observableThrow(response_);
        }));
    }

    protected processPing(response: HttpResponseBase): Observable<PingResultDTO> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PingResultDTO.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status === 500) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result500: any = null;
            let resultData500 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result500 = APIResultDTO.fromJS(resultData500);
            return throwException("Internal Server Error", status, _responseText, _headers, result500);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<PingResultDTO>(<any>null);
    }

    /**
     * Returns a list of API Result codes and descriptions
     * @return Operation completed successfully
     */
    getAPIResultList(): Observable<APIResultDTO[]> {
        let url_ = this.baseUrl + "/APIResult";
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetAPIResultList(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetAPIResultList(<any>response_);
                } catch (e) {
                    return <Observable<APIResultDTO[]>><any>_observableThrow(e);
                }
            } else
                return <Observable<APIResultDTO[]>><any>_observableThrow(response_);
        }));
    }

    protected processGetAPIResultList(response: HttpResponseBase): Observable<APIResultDTO[]> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            if (Array.isArray(resultData200)) {
                result200 = [] as any;
                for (let item of resultData200)
                    result200!.push(APIResultDTO.fromJS(item));
            }
            else {
                result200 = <any>null;
            }
            return _observableOf(result200);
            }));
        } else if (status === 500) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result500: any = null;
            let resultData500 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result500 = APIResultDTO.fromJS(resultData500);
            return throwException("Internal Server Error", status, _responseText, _headers, result500);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<APIResultDTO[]>(<any>null);
    }
}

@Injectable()
export class KpayFixedqrPaymentPayment_RequestApiService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, @Optional() @Inject(KPAY_FIXEDQRPAYMENT_API_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "https://api.kpay.com.tr/FixedQRPayment/V1";
    }

    /**
     * Returns checkout information and the latest payment request made from a checkout point
     * @param qRString CheckoutCode (e.g. 'KPAY_QW3243_GR5672_XJK98O_000000') or KPayTxnID (e.g. 88091384-7d85-47a1-97eb-6573d706eedc) or Metropol QR (e.g. 637519724802)
     * @return OK (The request has succeeded)
     */
    getPaymentRequest(qRString: string): Observable<CheckoutPaymentRequestDTO> {
        let url_ = this.baseUrl + "/PaymentRequest/{QRString}";
        if (qRString === undefined || qRString === null)
            throw new Error("The parameter 'qRString' must be defined.");
        url_ = url_.replace("{QRString}", encodeURIComponent("" + qRString));
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "application/json"
            })
        };

        return this.http.request("get", url_, options_).pipe(_observableMergeMap((response_ : any) => {
            return this.processGetPaymentRequest(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processGetPaymentRequest(<any>response_);
                } catch (e) {
                    return <Observable<CheckoutPaymentRequestDTO>><any>_observableThrow(e);
                }
            } else
                return <Observable<CheckoutPaymentRequestDTO>><any>_observableThrow(response_);
        }));
    }

    protected processGetPaymentRequest(response: HttpResponseBase): Observable<CheckoutPaymentRequestDTO> {
        const status = response.status;
        const responseBlob =
            response instanceof HttpResponse ? response.body :
            (<any>response).error instanceof Blob ? (<any>response).error : undefined;

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); }}
        if (status === 200) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = CheckoutPaymentRequestDTO.fromJS(resultData200);
            return _observableOf(result200);
            }));
        } else if (status === 400) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result400: any = null;
            let resultData400 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result400 = APIResultDTO.fromJS(resultData400);
            return throwException("Bad Request", status, _responseText, _headers, result400);
            }));
        } else if (status === 401) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result401: any = null;
            let resultData401 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result401 = APIResultDTO.fromJS(resultData401);
            return throwException("Unauthorized", status, _responseText, _headers, result401);
            }));
        } else if (status === 403) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result403: any = null;
            let resultData403 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result403 = APIResultDTO.fromJS(resultData403);
            return throwException("Forbidden", status, _responseText, _headers, result403);
            }));
        } else if (status === 409) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result409: any = null;
            let resultData409 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result409 = APIResultDTO.fromJS(resultData409);
            return throwException("Conflict", status, _responseText, _headers, result409);
            }));
        } else if (status === 422) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result422: any = null;
            let resultData422 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result422 = APIResultDTO.fromJS(resultData422);
            return throwException("Unprocessable Entity", status, _responseText, _headers, result422);
            }));
        } else if (status === 500) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result500: any = null;
            let resultData500 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result500 = APIResultDTO.fromJS(resultData500);
            return throwException("Internal Server Error", status, _responseText, _headers, result500);
            }));
        } else if (status === 502) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            let result502: any = null;
            let resultData502 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result502 = APIResultDTO.fromJS(resultData502);
            return throwException("Bad Gateway", status, _responseText, _headers, result502);
            }));
        } else if (status !== 200 && status !== 204) {
            return blobToText(responseBlob).pipe(_observableMergeMap(_responseText => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            }));
        }
        return _observableOf<CheckoutPaymentRequestDTO>(<any>null);
    }
}

/** QR Payment Mode ('None' indicates that payments are disabled at the checkout) */
export enum QRPaymentModeEnum {
    None = "None",
    FixedQR = "FixedQR",
    FixedQRAndAmount = "FixedQRAndAmount",
    FixedQRAndFixedAmount = "FixedQRAndFixedAmount",
    DynamicQR = "DynamicQR",
    DynamicQRAndAmount = "DynamicQRAndAmount",
    DynamicQRAndFixedAmount = "DynamicQRAndFixedAmount",
    MetropolQR = "MetropolQR",
}

/** POS Terminal type */
export enum POSTerminalTypeEnum {
    KPayPOS = "KPayPOS",
    KPayPOSWorkinton = "KPayPOSWorkinton",
    KPayGO = "KPayGO",
    KPayWeb = "KPayWeb",
    MerchantPOS = "MerchantPOS",
    MerchantApp = "MerchantApp",
    MerchantWeb = "MerchantWeb",
    MetropolPOS = "MetropolPOS",
}

/** Contains information about a checkout and standing payment request (if any) */
export class CheckoutPaymentRequestDTO implements ICheckoutPaymentRequestDTO {
    /** Requesting institution code */
    institutionCode!: string;
    /** Requesting institution ERP code */
    institutionERPCode!: string;
    /** Requesting institution name */
    institutionName!: string;
    /** Institution branch code */
    branchCode!: string;
    /** Institution branch ERP code */
    branchERPCode!: string;
    /** Institution branch name */
    branchName!: string;
    /** Checkout point code */
    checkoutPointCode!: string;
    /** Checkout point name */
    checkoutPointName!: string;
    checkoutPointQRCode?: string;
    qRPaymentMode!: QRPaymentModeEnum;
    pOSTerminalType!: POSTerminalTypeEnum;
    /** Multiple payment requests can be done simultaneously */
    isMultiplePaymentsEnabled!: boolean;
    /** Indicates if there is an open request at this checkout */
    hasRequest!: boolean;
    requestTimestamp?: moment.Moment | undefined;
    kPayTxnID?: string;
    /** The requested payment amount */
    transactionAmountTRY?: number | undefined;
    /** The amount paid by the customer */
    paymentAmountTRY?: number | undefined;
    /** Discount amount (if any) (TransactionAmountTRY - PaymentAmountTRY) */
    discountAmountTRY?: number | undefined;
    /** Campaign name causing the discount (if any) */
    campaignInfo?: string;
    /** Product description */
    productDescription?: string;

    constructor(data?: ICheckoutPaymentRequestDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.institutionCode = _data["InstitutionCode"];
            this.institutionERPCode = _data["InstitutionERPCode"];
            this.institutionName = _data["InstitutionName"];
            this.branchCode = _data["BranchCode"];
            this.branchERPCode = _data["BranchERPCode"];
            this.branchName = _data["BranchName"];
            this.checkoutPointCode = _data["CheckoutPointCode"];
            this.checkoutPointName = _data["CheckoutPointName"];
            this.checkoutPointQRCode = _data["CheckoutPointQRCode"];
            this.qRPaymentMode = _data["QRPaymentMode"];
            this.pOSTerminalType = _data["POSTerminalType"];
            this.isMultiplePaymentsEnabled = _data["IsMultiplePaymentsEnabled"];
            this.hasRequest = _data["HasRequest"];
            this.requestTimestamp = _data["RequestTimestamp"] ? moment(_data["RequestTimestamp"].toString()) : <any>undefined;
            this.kPayTxnID = _data["KPayTxnID"];
            this.transactionAmountTRY = _data["TransactionAmountTRY"];
            this.paymentAmountTRY = _data["PaymentAmountTRY"];
            this.discountAmountTRY = _data["DiscountAmountTRY"];
            this.campaignInfo = _data["CampaignInfo"];
            this.productDescription = _data["ProductDescription"];
        }
    }

    static fromJS(data: any): CheckoutPaymentRequestDTO {
        data = typeof data === 'object' ? data : {};
        let result = new CheckoutPaymentRequestDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["InstitutionCode"] = this.institutionCode;
        data["InstitutionERPCode"] = this.institutionERPCode;
        data["InstitutionName"] = this.institutionName;
        data["BranchCode"] = this.branchCode;
        data["BranchERPCode"] = this.branchERPCode;
        data["BranchName"] = this.branchName;
        data["CheckoutPointCode"] = this.checkoutPointCode;
        data["CheckoutPointName"] = this.checkoutPointName;
        data["CheckoutPointQRCode"] = this.checkoutPointQRCode;
        data["QRPaymentMode"] = this.qRPaymentMode;
        data["POSTerminalType"] = this.pOSTerminalType;
        data["IsMultiplePaymentsEnabled"] = this.isMultiplePaymentsEnabled;
        data["HasRequest"] = this.hasRequest;
        data["RequestTimestamp"] = this.requestTimestamp ? this.requestTimestamp.toISOString() : <any>undefined;
        data["KPayTxnID"] = this.kPayTxnID;
        data["TransactionAmountTRY"] = this.transactionAmountTRY;
        data["PaymentAmountTRY"] = this.paymentAmountTRY;
        data["DiscountAmountTRY"] = this.discountAmountTRY;
        data["CampaignInfo"] = this.campaignInfo;
        data["ProductDescription"] = this.productDescription;
        return data; 
    }
}

/** Contains information about a checkout and standing payment request (if any) */
export interface ICheckoutPaymentRequestDTO {
    /** Requesting institution code */
    institutionCode: string;
    /** Requesting institution ERP code */
    institutionERPCode: string;
    /** Requesting institution name */
    institutionName: string;
    /** Institution branch code */
    branchCode: string;
    /** Institution branch ERP code */
    branchERPCode: string;
    /** Institution branch name */
    branchName: string;
    /** Checkout point code */
    checkoutPointCode: string;
    /** Checkout point name */
    checkoutPointName: string;
    checkoutPointQRCode?: string;
    qRPaymentMode: QRPaymentModeEnum;
    pOSTerminalType: POSTerminalTypeEnum;
    /** Multiple payment requests can be done simultaneously */
    isMultiplePaymentsEnabled: boolean;
    /** Indicates if there is an open request at this checkout */
    hasRequest: boolean;
    requestTimestamp?: moment.Moment | undefined;
    kPayTxnID?: string;
    /** The requested payment amount */
    transactionAmountTRY?: number | undefined;
    /** The amount paid by the customer */
    paymentAmountTRY?: number | undefined;
    /** Discount amount (if any) (TransactionAmountTRY - PaymentAmountTRY) */
    discountAmountTRY?: number | undefined;
    /** Campaign name causing the discount (if any) */
    campaignInfo?: string;
    /** Product description */
    productDescription?: string;
}

/** Result of the API operation */
export class APIResultDTO implements IAPIResultDTO {
    /** An integer code indicating the result of the operation */
    code!: number;
    /** A description of the result code */
    message!: string;
    /** Error list (if any) */
    errors?: string[];

    constructor(data?: IAPIResultDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.code = _data["Code"];
            this.message = _data["Message"];
            if (Array.isArray(_data["Errors"])) {
                this.errors = [] as any;
                for (let item of _data["Errors"])
                    this.errors!.push(item);
            }
        }
    }

    static fromJS(data: any): APIResultDTO {
        data = typeof data === 'object' ? data : {};
        let result = new APIResultDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["Code"] = this.code;
        data["Message"] = this.message;
        if (Array.isArray(this.errors)) {
            data["Errors"] = [];
            for (let item of this.errors)
                data["Errors"].push(item);
        }
        return data; 
    }
}

/** Result of the API operation */
export interface IAPIResultDTO {
    /** An integer code indicating the result of the operation */
    code: number;
    /** A description of the result code */
    message: string;
    /** Error list (if any) */
    errors?: string[];
}

/** Ping result */
export class PingResultDTO implements IPingResultDTO {
    /** Server date and time in ISO 8601 format */
    serverDateTime!: moment.Moment;

    constructor(data?: IPingResultDTO) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.serverDateTime = _data["ServerDateTime"] ? moment(_data["ServerDateTime"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): PingResultDTO {
        data = typeof data === 'object' ? data : {};
        let result = new PingResultDTO();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["ServerDateTime"] = this.serverDateTime ? this.serverDateTime.toISOString() : <any>undefined;
        return data; 
    }
}

/** Ping result */
export interface IPingResultDTO {
    /** Server date and time in ISO 8601 format */
    serverDateTime: moment.Moment;
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): Observable<any> {
    if (result !== null && result !== undefined)
        return _observableThrow(result);
    else
        return _observableThrow(new ApiException(message, status, response, headers, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = getFileReader();
            reader.onload = event => {
                observer.next((<any>event.target).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
}
export function getFileReader(): FileReader {
	const fileReader = new FileReader();
	const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
	return zoneOriginalInstance || fileReader;
}