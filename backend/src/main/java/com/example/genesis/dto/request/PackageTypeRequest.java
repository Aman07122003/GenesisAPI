package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Represents the package type supplied as part of a quotation request.
 *
 * <p>The package type identifies how the shipment is classified by the
 * Genesis API. For example, a shipment may use {@code Package} as its
 * package type.</p>
 */
public final class PackageTypeRequest {

    @NotBlank
    private final String name;

    /**
     * Creates a package type request.
     *
     * <p>The constructor is used by Jackson to deserialize the package
     * type object received from the frontend.</p>
     *
     * @param name package type name expected by the Genesis API
     */
    @JsonCreator
    public PackageTypeRequest(
            @JsonProperty("name") final String name) {

        this.name = name;
    }

    /**
     * Returns the package type name.
     *
     * @return package type name
     */
    public String getName() {
        return name;
    }
}