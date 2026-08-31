package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * Represents a request to create a shipment using a previously selected
 * quotation.
 *
 * <p>The selected quotation request is wrapped inside the
 * {@code shippingOrderRateDTO} property and submitted to the Genesis
 * shipment API. The nested {@link QuoteRequest} is validated before the
 * shipment request is forwarded to the service layer.</p>
 */
public final class ShipmentRequest {

    @Valid
    @NotNull
    private final QuoteRequest shippingOrderRateDTO;

    /**
     * Creates a shipment request containing the quotation and shipment
     * information required by the Genesis shipment API.
     *
     * <p>The constructor is used by Jackson to deserialize the shipment
     * creation request received from the Angular frontend.</p>
     *
     * @param shippingOrderRateDTO quotation and shipment details associated
     *                             with the selected shipping rate
     */
    @JsonCreator
    public ShipmentRequest(
            @JsonProperty("shippingOrderRateDTO")
            final QuoteRequest shippingOrderRateDTO) {

        this.shippingOrderRateDTO = shippingOrderRateDTO;
    }

    /**
     * Returns the quotation and shipment details used to create the shipment.
     *
     * @return quotation request associated with the selected shipping rate
     */
    public QuoteRequest getShippingOrderRateDTO() {
        return shippingOrderRateDTO;
    }
}