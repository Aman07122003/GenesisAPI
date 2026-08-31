package com.example.genesis.dto.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Represents a package included in a quotation request.
 *
 * <p>The package information is used by the Genesis quotation API to
 * calculate shipping rates based on the package description, dimensions,
 * and weight. A quotation request may contain multiple package items.</p>
 *
 * <p>All dimensional and weight values must be greater than zero. The
 * values are represented using {@link BigDecimal} to preserve numeric
 * precision when processing shipment measurements.</p>
 */
public final class PackageItemRequest {

    @NotBlank
    private final String description;

    @DecimalMin("0.01")
    @NotNull
    private final BigDecimal height;

    @DecimalMin("0.01")
    @NotNull
    private final BigDecimal length;

    @DecimalMin("0.01")
    @NotNull
    private final BigDecimal weight;

    @DecimalMin("0.01")
    @NotNull
    private final BigDecimal width;

    /**
     * Creates a package item request containing the package description,
     * dimensions, and weight.
     *
     * <p>The constructor is used by Jackson to deserialize package
     * information received from the frontend.</p>
     *
     * @param description description of the package contents
     * @param height      package height
     * @param length      package length
     * @param weight      package weight
     * @param width       package width
     */
    @JsonCreator
    public PackageItemRequest(
            @JsonProperty("description") final String description,
            @JsonProperty("height") final BigDecimal height,
            @JsonProperty("length") final BigDecimal length,
            @JsonProperty("weight") final BigDecimal weight,
            @JsonProperty("width") final BigDecimal width) {

        this.description = description;
        this.height = height;
        this.length = length;
        this.weight = weight;
        this.width = width;
    }

    /**
     * Returns the description of the package contents.
     *
     * @return package description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Returns the package height.
     *
     * @return package height
     */
    public BigDecimal getHeight() {
        return height;
    }

    /**
     * Returns the package length.
     *
     * @return package length
     */
    public BigDecimal getLength() {
        return length;
    }

    /**
     * Returns the package weight.
     *
     * @return package weight
     */
    public BigDecimal getWeight() {
        return weight;
    }

    /**
     * Returns the package width.
     *
     * @return package width
     */
    public BigDecimal getWidth() {
        return width;
    }
}