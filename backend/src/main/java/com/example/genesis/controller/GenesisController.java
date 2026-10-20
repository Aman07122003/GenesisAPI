package com.example.genesis.controller;

import com.example.genesis.dto.request.QuoteRequest;
import com.example.genesis.dto.request.ShipmentRequest;
import com.example.genesis.dto.response.CurrencyRatesResponse;
import com.example.genesis.dto.response.QuoteResponse;
import com.example.genesis.dto.response.ShipmentResponse;
import com.example.genesis.service.CurrencyService;
import com.example.genesis.service.GenesisService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that exposes shipment quotation, shipment creation,
 * and currency exchange-rate endpoints to the frontend application.
 *
 * <p>The controller is responsible for receiving HTTP requests,
 * validating request payloads, and delegating processing to the
 * appropriate service layer.</p>
 */
@CrossOrigin(origins = {
        "http://localhost:4200",
        "https://production.d3223rut17avj1.amplifyapp.com"
})
@RestController
@RequestMapping("/api")
public final class GenesisController {

    private final GenesisService service;
    private final CurrencyService currencyService;

    /**
     * Creates the controller with the required application services.
     *
     * @param genesisService service responsible for shipment and quotation
     *                       operations
     * @param currencyService service responsible for retrieving currency
     *                        exchange rates
     */
    public GenesisController(
            final GenesisService genesisService,
            final CurrencyService currencyService) {

        this.service = genesisService;
        this.currencyService = currencyService;
    }

    /**
     * Creates a shipment using the supplied shipment details.
     *
     * <p>The request is validated before being delegated to the
     * {@link GenesisService}. The returned response contains shipment
     * tracking information and generated shipping labels.</p>
     *
     * @param request validated shipment request
     * @return shipment response containing tracking information and labels
     */
    @PostMapping("/shipments")
    public ShipmentResponse createShipment(
            @Valid @RequestBody final ShipmentRequest request) {

        return service.createShipment(request);
    }

    /**
     * Retrieves currency exchange rates for the requested base currency.
     *
     * <p>If no base currency is provided, CAD is used by default.</p>
     *
     * <p>Example request:
     * {@code GET /api/currency/rates?base=CAD}</p>
     *
     * @param base base currency code, for example {@code CAD}
     * @return response containing the supported currency exchange rates
     */
    @GetMapping("/currency/rates")
    public CurrencyRatesResponse getCurrencyRates(
            @RequestParam(defaultValue = "CAD") final String base) {

        return currencyService.getRates(base);
    }

    /**
     * Retrieves available shipping quotations for the supplied shipment
     * details.
     *
     * <p>The request is validated before being delegated to the
     * {@link GenesisService}. The response contains the shipping rates
     * available for the shipment.</p>
     *
     * @param request validated quotation request
     * @return quotation response containing available shipping rates
     */
    @PostMapping("/quotes")
    public QuoteResponse getQuotes(
            @Valid @RequestBody final QuoteRequest request) {

        return service.getQuotes(request);
    }
}