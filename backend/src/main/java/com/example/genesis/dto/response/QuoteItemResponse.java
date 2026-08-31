package com.example.genesis.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * Represents a shipping quotation returned by the Genesis quotation API.
 *
 * <p>This response contains the pricing, service, weight, volume, currency,
 * and estimated transit information associated with a shipping service.</p>
 */
public final class QuoteItemResponse {

    private final BigDecimal actualWeight;
    private final BigDecimal billableWeight;
    private final BigDecimal charge;
    private final String costCurrencyCode;
    private final BigDecimal dimensionalWeight;
    private final Integer estTransitDays;
    private final BigDecimal fuelSurchargePercent;
    private final String serviceCode;
    private final String serviceMode;
    private final String serviceName;
    private final Integer totalPackages;
    private final BigDecimal volume;
    private final String volumeUnit;
    private final String weightUnit;

    /**
     * Creates a shipping quotation response from the Genesis API response.
     *
     * @param actualWeight             actual shipment weight
     * @param billableWeight           weight used to calculate the shipping charge
     * @param charge                   shipping charge for the selected service
     * @param costCurrencyCode         currency code used for the shipping charge
     * @param dimensionalWeight       calculated dimensional weight
     * @param estTransitDays           estimated number of transit days
     * @param fuelSurchargePercent     fuel surcharge percentage
     * @param serviceCode              Genesis service code
     * @param serviceMode              shipping mode, such as Air, Ground, or Sea
     * @param serviceName              display name of the shipping service
     * @param totalPackages            total number of packages in the shipment
     * @param volume                   total shipment volume
     * @param volumeUnit               unit used to represent shipment volume
     * @param weightUnit               unit used to represent shipment weight
     */
    @SuppressWarnings("checkstyle:ParameterNumber")
    @JsonCreator
    public QuoteItemResponse(
            @JsonProperty("actualWeight") final BigDecimal actualWeight,
            @JsonProperty("billableWeight") final BigDecimal billableWeight,
            @JsonProperty("charge") final BigDecimal charge,
            @JsonProperty("costCurrencyCode") final String costCurrencyCode,
            @JsonProperty("dimensionalWeight") final BigDecimal dimensionalWeight,
            @JsonProperty("estTransitDays") final Integer estTransitDays,
            @JsonProperty("fuelSurchargePercent") final BigDecimal fuelSurchargePercent,
            @JsonProperty("serviceCode") final String serviceCode,
            @JsonProperty("serviceMode") final String serviceMode,
            @JsonProperty("serviceName") final String serviceName,
            @JsonProperty("totalPackages") final Integer totalPackages,
            @JsonProperty("volume") final BigDecimal volume,
            @JsonProperty("volumeUnit") final String volumeUnit,
            @JsonProperty("weightUnit") final String weightUnit) {

        this.actualWeight = actualWeight;
        this.billableWeight = billableWeight;
        this.charge = charge;
        this.costCurrencyCode = costCurrencyCode;
        this.dimensionalWeight = dimensionalWeight;
        this.estTransitDays = estTransitDays;
        this.fuelSurchargePercent = fuelSurchargePercent;
        this.serviceCode = serviceCode;
        this.serviceMode = serviceMode;
        this.serviceName = serviceName;
        this.totalPackages = totalPackages;
        this.volume = volume;
        this.volumeUnit = volumeUnit;
        this.weightUnit = weightUnit;
    }

    /**
     * Returns the actual shipment weight.
     *
     * @return actual shipment weight
     */
    public BigDecimal getActualWeight() {
        return actualWeight;
    }

    /**
     * Returns the billable weight used for rating.
     *
     * @return billable shipment weight
     */
    public BigDecimal getBillableWeight() {
        return billableWeight;
    }

    /**
     * Returns the shipping charge.
     *
     * @return shipping charge
     */
    public BigDecimal getCharge() {
        return charge;
    }

    /**
     * Returns the currency code used for the shipping charge.
     *
     * @return shipping cost currency code
     */
    public String getCostCurrencyCode() {
        return costCurrencyCode;
    }

    /**
     * Returns the dimensional weight calculated for the shipment.
     *
     * @return dimensional shipment weight
     */
    public BigDecimal getDimensionalWeight() {
        return dimensionalWeight;
    }

    /**
     * Returns the estimated transit time.
     *
     * @return estimated transit days
     */
    public Integer getEstTransitDays() {
        return estTransitDays;
    }

    /**
     * Returns the fuel surcharge percentage.
     *
     * @return fuel surcharge percentage
     */
    public BigDecimal getFuelSurchargePercent() {
        return fuelSurchargePercent;
    }

    /**
     * Returns the Genesis service code.
     *
     * @return shipping service code
     */
    public String getServiceCode() {
        return serviceCode;
    }

    /**
     * Returns the shipping mode used by the service.
     *
     * @return shipping service mode
     */
    public String getServiceMode() {
        return serviceMode;
    }

    /**
     * Returns the display name of the shipping service.
     *
     * @return shipping service name
     */
    public String getServiceName() {
        return serviceName;
    }

    /**
     * Returns the total number of packages included in the shipment.
     *
     * @return total package count
     */
    public Integer getTotalPackages() {
        return totalPackages;
    }

    /**
     * Returns the total shipment volume.
     *
     * @return shipment volume
     */
    public BigDecimal getVolume() {
        return volume;
    }

    /**
     * Returns the unit used to represent shipment volume.
     *
     * @return shipment volume unit
     */
    public String getVolumeUnit() {
        return volumeUnit;
    }

    /**
     * Returns the unit used to represent shipment weight.
     *
     * @return shipment weight unit
     */
    public String getWeightUnit() {
        return weightUnit;
    }
}