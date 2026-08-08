// ============================================================
// Address / Location
// ============================================================

export interface AddressInfo {
  attention: string;
  company: string;
  address1: string;
  address2?: string;

  postalCode: string;

  phone: string;
  email?: string;

  countryDTO: {
    name: string;
  };

  provinceDTO: {
    alpha2code: string;
    countryCode: string;
    name: string;
  };

  countryName: string;
  provinceName: string;
  cityName: string;
  alphaNumericPostalCode: string;
  countryCode: string;
}


// ============================================================
// Package
// ============================================================

export interface ShipmentPackage {
  description: string;
  height: number;
  length: number;
  weight: number;
  width: number;
}


// ============================================================
// DTO
// ============================================================

export interface DTOWrapper<T = string> {
  name: T;
}


export interface ShipmentUnitDTO {
  name: string;
  system: string;
}


// ============================================================
// Additional Services
// ============================================================

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


// ============================================================
// COD
// ============================================================

export interface ShippingOrderCODService {
  codServiceId: number;
}


// ============================================================
// Quote Request
// ============================================================

export interface QuoteRequest {
  shipFrom: AddressInfo;
  shipTo: AddressInfo;

  scheduledShipDate: string;

  packageTypeDTO: DTOWrapper;

  shipmentPackageUnits: ShipmentUnitDTO;

  shipmentPackages: ShipmentPackage[];

  shippingOrderAddSvc: ShippingOrderAddSvc;

  shippingOrderCODService: ShippingOrderCODService;

  codAddress: null;

  currencyCode: string;
}


// ============================================================
// Quote Response
// ============================================================

export interface Rate {
  serviceCode: string;
  charge: number;
  fuelSurchargePercent: number;
  estTransitDays: number;

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


// ============================================================
// Shipment
// ============================================================

export interface ShipmentRequest {
  shippingOrderRateDTO: QuoteRequest;
}

export interface ShipmentResponse {
  masterTrackingNumber: string;

  labels?: {
    content: string;
    height: number;
    length: number;
    totalGrossWeight: number;
    trackingNumber: string;
    type: string;
    volumeUnit: string;
    weightUnit: string;
    width: number;
  }[];
}

