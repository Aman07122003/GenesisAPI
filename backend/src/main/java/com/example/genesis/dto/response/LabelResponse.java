package com.example.genesis.dto.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents a shipping label returned by the Genesis shipment API.
 *
 * <p>The label content is provided as a Base64-encoded document. The
 * remaining properties describe the package associated with the label,
 * including its dimensions, weight, units, and tracking information.</p>
 */
public final class LabelResponse {

    private final String content;
    private final double height;
    private final double length;
    private final double totalGrossWeight;
    private final String trackingNumber;
    private final String type;
    private final String volumeUnit;
    private final String weightUnit;
    private final double width;

    /**
     * Creates a shipment label response from the Genesis API response.
     *
     * @param content            Base64-encoded label document content
     * @param height             package height
     * @param length             package length
     * @param totalGrossWeight   total gross package weight
     * @param trackingNumber     tracking number assigned to the package
     * @param type               MIME type of the label document
     * @param volumeUnit         unit used to represent package volume
     * @param weightUnit         unit used to represent package weight
     * @param width              package width
     */
    @JsonCreator
    public LabelResponse(
            @JsonProperty("content") final String content,
            @JsonProperty("height") final double height,
            @JsonProperty("length") final double length,
            @JsonProperty("totalGrossWeight") final double totalGrossWeight,
            @JsonProperty("trackingNumber") final String trackingNumber,
            @JsonProperty("type") final String type,
            @JsonProperty("volumeUnit") final String volumeUnit,
            @JsonProperty("weightUnit") final String weightUnit,
            @JsonProperty("width") final double width) {

        this.content = content;
        this.height = height;
        this.length = length;
        this.totalGrossWeight = totalGrossWeight;
        this.trackingNumber = trackingNumber;
        this.type = type;
        this.volumeUnit = volumeUnit;
        this.weightUnit = weightUnit;
        this.width = width;
    }

    /**
     * Returns the Base64-encoded label document.
     *
     * @return Base64-encoded label content
     */
    public String getContent() {
        return content;
    }

    /**
     * Returns the package height.
     *
     * @return package height
     */
    public double getHeight() {
        return height;
    }

    /**
     * Returns the package length.
     *
     * @return package length
     */
    public double getLength() {
        return length;
    }

    /**
     * Returns the total gross weight of the package.
     *
     * @return total gross package weight
     */
    public double getTotalGrossWeight() {
        return totalGrossWeight;
    }

    /**
     * Returns the tracking number assigned to the package.
     *
     * @return package tracking number
     */
    public String getTrackingNumber() {
        return trackingNumber;
    }

    /**
     * Returns the MIME type of the label document.
     *
     * @return label document MIME type
     */
    public String getType() {
        return type;
    }

    /**
     * Returns the unit used to represent package volume.
     *
     * @return package volume unit
     */
    public String getVolumeUnit() {
        return volumeUnit;
    }

    /**
     * Returns the unit used to represent package weight.
     *
     * @return package weight unit
     */
    public String getWeightUnit() {
        return weightUnit;
    }

    /**
     * Returns the package width.
     *
     * @return package width
     */
    public double getWidth() {
        return width;
    }
}