import { BaseResource, type RequestOptions } from '../core/resource/base-resource.js';
import type {
  GetAzerbaijanCitiesResponse,
  GetAzerbaijanDistrictsResponse,
  GetCitiesByCountryResponse,
  GetCountriesResponse,
  GetDistrictsByCityResponse,
  GetTurkeyCitiesResponse,
  GetTurkeyDistrictsResponse,
  GetTurkeyNeighborhoodsResponse,
} from '../generated/marketplace.js';

/**
 * Address reference data: countries, cities, districts, neighbourhoods.
 *
 * Trendyol exposes separate endpoints per market rather than one parametrised
 * tree, so the domestic (TR, AZ) and international lookups differ in shape.
 * These lists change rarely — cache them.
 *
 * @see https://developers.trendyol.com/v2.0/reference/address-information
 */
export class AddressesResource extends BaseResource {
  /**
   * Countries Trendyol operates in.
   *
   * @operationId getCountries
   */
  countries(options: RequestOptions = {}): Promise<GetCountriesResponse> {
    return this.transport.request<GetCountriesResponse>({
      operationId: 'getCountries',
      method: 'GET',
      path: '/member/countries',
      ...this.options(options),
    });
  }

  /**
   * Cities of a GULF / CEE country.
   *
   * @operationId getCitiesByCountry
   */
  cities(countryCode: string, options: RequestOptions = {}): Promise<GetCitiesByCountryResponse> {
    return this.transport.request<GetCitiesByCountryResponse>({
      operationId: 'getCitiesByCountry',
      method: 'GET',
      path: '/member/countries/{CountryCode}/cities',
      pathParams: { CountryCode: countryCode },
      ...this.options(options),
    });
  }

  /**
   * Districts of a city in a GULF / CEE country.
   *
   * `cityId` is the `id` from {@link cities}.
   *
   * @operationId getDistrictsByCity
   */
  districts(countryCode: string, cityId: number | string, options: RequestOptions = {}): Promise<GetDistrictsByCityResponse> {
    return this.transport.request<GetDistrictsByCityResponse>({
      operationId: 'getDistrictsByCity',
      method: 'GET',
      path: '/member/countries/{CountryCode}/cities/{cityId}/districts',
      pathParams: { CountryCode: countryCode, cityId },
      ...this.options(options),
    });
  }

  /**
   * Cities of Türkiye.
   *
   * @operationId getTurkeyCities
   */
  turkeyCities(options: RequestOptions = {}): Promise<GetTurkeyCitiesResponse> {
    return this.transport.request<GetTurkeyCitiesResponse>({
      operationId: 'getTurkeyCities',
      method: 'GET',
      path: '/member/countries/domestic/TR/cities',
      ...this.options(options),
    });
  }

  /**
   * Districts of a Turkish city.
   *
   * Takes the city's **`id`** (e.g. `100` for Adana), despite the path
   * parameter being spelled `CityCode` in Trendyol's documentation. Passing the
   * `code` field returned by {@link turkeyCities} — `"1"` for Adana — answers
   * `500`. Verified against production on 2026-08-24.
   *
   * @operationId getTurkeyDistricts
   */
  turkeyDistricts(cityId: number | string, options: RequestOptions = {}): Promise<GetTurkeyDistrictsResponse> {
    return this.transport.request<GetTurkeyDistrictsResponse>({
      operationId: 'getTurkeyDistricts',
      method: 'GET',
      path: '/member/countries/domestic/TR/cities/{CityCode}/districts',
      pathParams: { CityCode: cityId },
      ...this.options(options),
    });
  }

  /**
   * Neighbourhoods of a Turkish district.
   *
   * Both arguments are **`id`** values, not codes — districts come back with an
   * empty `code`, so the id is the only usable identifier. Verified against
   * production on 2026-08-24.
   *
   * @operationId getTurkeyNeighborhoods
   */
  turkeyNeighborhoods(
    cityId: number | string,
    districtId: number | string,
    options: RequestOptions = {}
  ): Promise<GetTurkeyNeighborhoodsResponse> {
    return this.transport.request<GetTurkeyNeighborhoodsResponse>({
      operationId: 'getTurkeyNeighborhoods',
      method: 'GET',
      path: '/member/countries/domestic/TR/cities/{CityCode}/districts/{DistrictCode}/neighborhoods',
      pathParams: { CityCode: cityId, DistrictCode: districtId },
      ...this.options(options),
    });
  }

  /**
   * Cities of Azerbaijan.
   *
   * @operationId getAzerbaijanCities
   */
  azerbaijanCities(options: RequestOptions = {}): Promise<GetAzerbaijanCitiesResponse> {
    return this.transport.request<GetAzerbaijanCitiesResponse>({
      operationId: 'getAzerbaijanCities',
      method: 'GET',
      path: '/member/countries/domestic/AZ/cities',
      ...this.options(options),
    });
  }

  /**
   * Districts of an Azerbaijani city.
   *
   * Takes the city's **`id`**, like its Turkish counterpart. Verified against
   * production on 2026-08-24.
   *
   * @operationId getAzerbaijanDistricts
   */
  azerbaijanDistricts(
    cityId: number | string,
    options: RequestOptions = {}
  ): Promise<GetAzerbaijanDistrictsResponse> {
    return this.transport.request<GetAzerbaijanDistrictsResponse>({
      operationId: 'getAzerbaijanDistricts',
      method: 'GET',
      path: '/member/countries/domestic/AZ/cities/{cityCode}/districts',
      pathParams: { cityCode: cityId },
      ...this.options(options),
    });
  }
}
