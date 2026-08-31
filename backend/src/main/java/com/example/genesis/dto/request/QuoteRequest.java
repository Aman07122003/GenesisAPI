package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Represents a complete quotation request submitted by the frontend.
 *
 * <p>This DTO contains all shipment information required by the Genesis
 * quotation API to calculate available shipping rates. It includes the
 * shipment origin, destination, package type, package details, scheduled
 * shipping date, and currency.</p>
 *
 * <p>The request is validated before it is passed to the service layer.
 * Nested request objects and package items are also validated through
 * {@link Valid}.</p>
 */
public final class QuoteRequest {

    @NotBlank
    @Size(max = 3)
    @JsonProperty
    private final String currencyCode;

    @Valid
    @NotNull
    @JsonProperty
    private final PackageTypeRequest packageTypeDTO;

    @NotBlank
    @JsonProperty
    private final String scheduledShipDate;

    @Valid
    @NotNull
    @JsonProperty
    private final AddressRequest shipFrom;

    @NotEmpty
    @Size(max = 30)
    @JsonProperty
    private final List<@NotNull @Valid PackageItemRequest> shipmentPackages;

    @Valid
    @NotNull
    @JsonProperty
    private final ShipmentUnitRequest shipmentPackageUnits;

    @Valid
    @NotNull
    @JsonProperty
    private final AddressRequest shipTo;

    /**
     * Creates a quotation request containing the shipment information
     * required by the Genesis quotation API.
     *
     * <p>The constructor is used by Jackson to deserialize the JSON
     * request received from the Angular frontend.</p>
     *
     * @param currencyCode         three-character currency code used for
     *                             quotation pricing, such as {@code CAD}
     * @param packageTypeDTO       package type associated with the shipment
     * @param scheduledShipDate    requested shipment date and time
     * @param shipFrom             origin address of the shipment
     * @param shipmentPackages     packages included in the shipment
     * @param shipmentPackageUnits measurement unit configuration used for
     *                             package dimensions and weight
     * @param shipTo               destination address of the shipment
     */
    @JsonCreator
    public QuoteRequest(
            @JsonProperty("currencyCode") final String currencyCode,
            @JsonProperty("packageTypeDTO")
            final PackageTypeRequest packageTypeDTO,
            @JsonProperty("scheduledShipDate")
            final String scheduledShipDate,
            @JsonProperty("shipFrom")
            final AddressRequest shipFrom,
            @JsonProperty("shipmentPackages")
            final List<PackageItemRequest> shipmentPackages,
            @JsonProperty("shipmentPackageUnits")
            final ShipmentUnitRequest shipmentPackageUnits,
            @JsonProperty("shipTo")
            final AddressRequest shipTo) {

        this.currencyCode = currencyCode;
        this.packageTypeDTO = packageTypeDTO;
        this.scheduledShipDate = scheduledShipDate;
        this.shipFrom = shipFrom;
        this.shipmentPackages = shipmentPackages == null
                ? List.of()
                : List.copyOf(shipmentPackages);
        this.shipmentPackageUnits = shipmentPackageUnits;
        this.shipTo = shipTo;
    }

    /**
     * Returns the currency in which the quotation charges should be provided.
     *
     * @return three-character currency code
     */
    public String getCurrencyCode() {
        return currencyCode;
    }

    /**
     * Returns the package type selected for the shipment.
     *
     * @return package type request
     */
    public PackageTypeRequest getPackageTypeDTO() {
        return packageTypeDTO;
    }

    /**
     * Returns the requested shipment date and time.
     *
     * @return scheduled shipment date and time
     */
    public String getScheduledShipDate() {
        return scheduledShipDate;
    }

    /**
     * Returns the address from which the shipment originates.
     *
     * @return shipment origin address
     */
    public AddressRequest getShipFrom() {
        return shipFrom;
    }

    /**
     * Returns the packages included in the quotation request.
     *
     * <p>The returned list is immutable, preventing callers from modifying
     * the request after it has been created.</p>
     *
     * @return immutable list of shipment packages
     */
    public List<PackageItemRequest> getShipmentPackages() {
        return List.copyOf(shipmentPackages);
    }

    /**
     * Returns the measurement unit configuration for shipment packages.
     *
     * @return shipment package unit configuration
     */
    public ShipmentUnitRequest getShipmentPackageUnits() {
        return shipmentPackageUnits;
    }

    /**
     * Returns the destination address to which the shipment will be delivered.
     *
     * @return shipment destination address
     */
    public AddressRequest getShipTo() {
        return shipTo;
    }
}
