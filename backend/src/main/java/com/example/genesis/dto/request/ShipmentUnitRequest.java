package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Represents the measurement unit configuration for shipment packages.
 *
 * <p>The Genesis quotation API requires this information to determine
 * how package dimensions and weights should be interpreted.</p>
 */
public final class ShipmentUnitRequest {

    @NotBlank
    private final String name;

    @NotBlank
    private final String system;

    /**
     * Creates a shipment package unit request.
     *
     * @param name measurement unit name used for the shipment packages
     * @param system measurement system associated with the unit
     */
    @JsonCreator
    public ShipmentUnitRequest(
            @JsonProperty("name") final String name,
            @JsonProperty("system") final String system) {
        this.name = name;
        this.system = system;
    }

    /**
     * Returns the measurement unit name.
     *
     * @return shipment package unit name
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the measurement system used by the shipment.
     *
     * @return measurement system
     */
    public String getSystem() {
        return system;
    }
}