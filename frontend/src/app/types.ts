// Address/Location types
export interface AddressInfo {
  attention: string;
  company: string;
  address1: string;
  address2?: string;
  provinceDTO: {
    alpha2code: string;
    countryCode: string;
    name: string; // Format: "CA-ON"
  };
  postalCode: string;
  countryDTO: {
    name: string; // Country code, e.g., "CA"
  };
  phone: string;
  email?: string;
  countryCode: string;
  countryName: string;
  provinceName: string;
  cityName: string;
  alphaNumericPostalCode: string;
}

// Package info
export interface ShipmentPackage {
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
}

// DTO wrapper types for API
export interface DTOWrapper<T = string> {
  name: T;
}

export interface ShipmentUnitDTO {
  name: string;
  system: string;
}

// Additional services
export interface ShippingOrderAddSvc {
  ambientTemperatureRequired: boolean;
  coldChainRequired: boolean;
  crossBorderFee: boolean;
  customsFreight: boolean;
  dangerousGoods: number;
  deliveryAppt: boolean;
  docsOnly: boolean;
  excessLength: boolean;
  exibitionSite: boolean;
  heated: boolean;
  hold: boolean;
  homelandSecurity: boolean;
  inBondFee: boolean;
  insideDelivery: boolean;
  insidePickup: boolean;
  keepCoolRequired: boolean;
  limitedAccess: boolean;
  militaryBaseDelivery: boolean;
  pierCharge: boolean;
  returnService: boolean;
  satDelivery: boolean;
  saturdayPickup: boolean;
  shipFromTailgate: boolean;
  shipToTailgate: boolean;
  signatureRequired: number;
  singleShipment: boolean;
  fbaApproved: boolean;
  sortSegregate: boolean;
  noSafeDrop: boolean;
  insuranceType: number;
  insuredAmount: number;
  fbaapproved: boolean;
}

export interface ShippingOrderCODService {
  codServiceId: number;
}

// Quote request/response
export interface QuoteRequest {
  scheduledShipDate: string; // Format: "YYYY-MM-DD HH:mm"
  shipFrom: AddressInfo;
  shipTo: AddressInfo;
  packageTypeDTO: DTOWrapper;
  shipmentPackageUnits: ShipmentUnitDTO;
  shipmentPackages: ShipmentPackage[];
  shippingOrderAddSvc: ShippingOrderAddSvc;
  shippingOrderCODService: ShippingOrderCODService;
  codAddress: null;
  currencyCode: string;
}

export interface Rate {
  serviceCode: string;
  charge: number;
  fuelSurchargePercent: number;
  estTransitDays: number;
  // Additional fields we ignore for display
  actualWeight?: number;
  billableWeight?: number;
  dimensionalWeight?: number;
  totalPackages?: number;
  volume?: number;
  volumeUnit?: string;
  weightUnit?: string;
  costCurrencyCode?: string;
}

export interface QuoteResponse {
  rates: Rate[];
}

// Shipment request/response
export interface ShipmentRequest extends QuoteRequest {
  selectedRate: Rate;
}

export interface ShipmentResponse {
  masterTrackingNumber: string;
  pdf?: string | Blob | ArrayBuffer; // Format depends on API implementation
}
