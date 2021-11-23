export class Order {
	sellerId?: number;
	sellerName?: string;
	amount?: number;
	point?: number;
	checkoutCode?: string;
	customerID?: string;
	txnID?: string;
	note: string;
	isMetropol: boolean;
	readonly createdAt?: Date;

	constructor(data?: any) {
		this.createdAt = new Date();
		if (data) {
			for (const property in data) {
				if (data.hasOwnProperty(property)) {
					(<any>this)[property] = (<any>data)[property];
				}
			}
		}
	}

	init(data?: any) {
		if (data) {
			this.sellerId = data["sellerId"];
			this.sellerName = data["sellerName"];
			this.amount = data["amount"];
			this.point = data["point"];
			this.checkoutCode = data["checkoutCode"];
			this.customerID = data["customerID"];
			this.txnID = data["txnID"];
			this.note = data["note"];
			this.isMetropol = data["isMetropol"];
		}
	}

	toJSON(data?: any) {
		data = typeof data === "object" ? data : {};
		data["sellerId"] = this.sellerId;
		data["sellerName"] = this.sellerName;
		data["amount"] = this.amount;
		data["point"] = this.point;
		data["checkoutCode"] = this.checkoutCode;
		data["customerID"] = this.customerID;
		data["txnID"] = this.txnID;
		data["note"] = this.note;
		data["isMetropol"] = this.isMetropol;
		return data;
	}

	static fromJS(data: any): Order {
		data = typeof data === "object" ? data : {};
		let result = new Order();
		result.init(data);
		return result;
	}
}
