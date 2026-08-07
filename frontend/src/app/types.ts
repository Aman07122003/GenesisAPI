// Address/Location types
export interface AddressInfo {
  attention?: string;
  company?: string;
  address1: string;
  address2?: string;
  cityName: string;
  provinceDTO?: {
    alpha2code?: string;
    countryCode?: string;
    name?: string;
  };
  postalCode: string;
  countryDTO?: {
    name?: string;
  };
  phone?: string;
  email?: string;
  countryCode?: string;
  countryName?: string;
  provinceName?: string;
  alphaNumericPostalCode?: string;
}

// Package info
export interface ShipmentPackage {
  description?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  quantity?: number;
}

// Quote request/response
export interface QuoteRequest {
  scheduledShipDate: string;
  scheduledShipTime: string;
  shipFrom: AddressInfo;
  shipTo: AddressInfo;
  packageTypeDTO?: string;
  shipmentPackageUnits?: string;
  shipmentPackages?: ShipmentPackage[];
  shippingOrderAddSvc?: Record<string, boolean | string>;
  shippingOrderCODService?: Record<string, string | number>;
  codAddress?: AddressInfo;
  currencyCode?: string;
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
