package com.example.genesis.client;

import com.example.genesis.dto.request.QuoteRequest;
import com.example.genesis.dto.request.ShipmentRequest;
import com.example.genesis.dto.response.QuoteResponse;
import com.example.genesis.dto.response.ShipmentResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Client responsible for communicating with the external Genesis API.
 *
 * <p>This component handles HTTP communication for quotation and shipment
 * operations. It sends the application's request DTOs to the Genesis API
 * and maps the API responses into the corresponding response DTOs.</p>
 *
 * <p>No business logic or persistence is handled by this client. Its
 * responsibility is limited to communication with the external API.</p>
 */
@Component
public final class GenesisApiClient {

    private static final String BASE_URL = "https://genesis.eshipper.com";
    private final RestClient restClient;
    private static final String SHIPMENTS_PATH = "/api/shipments";
    private static final String QUOTES_PATH = "/api/quotes";

    /**
     * Creates a Genesis API client using the configured Genesis API base URL.
     */
    public GenesisApiClient() {
        this.restClient = RestClient.create(BASE_URL);
    }

    /**
     * Creates a shipment using the supplied shipment request.
     *
     * <p>The request is sent to the Genesis shipment endpoint as JSON.
     * The resulting response contains the master tracking number and
     * generated shipment labels.</p>
     *
     * @param request shipment details required by the Genesis API
     * @return the shipment response containing tracking information and labels
     */
    public ShipmentResponse createShipment(
            final ShipmentRequest request) {

        return restClient.post()
                .uri(SHIPMENTS_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ShipmentResponse.class);
    }

    /**
     * Retrieves available shipping quotations for the supplied shipment details.
     *
     * <p>The request is sent to the Genesis quotation endpoint as JSON.
     * The response contains the available shipping rates, including their
     * service name, charge, service mode, and estimated transit time.</p>
     *
     * @param request shipment details used to calculate shipping quotations
     * @return the quotation response containing available shipping rates
     */
    public QuoteResponse getQuotes(final QuoteRequest request) {

        return restClient.post()
                .uri(QUOTES_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(QuoteResponse.class);
    }
}