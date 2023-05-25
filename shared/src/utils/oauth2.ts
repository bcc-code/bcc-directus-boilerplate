import axios, { AxiosRequestConfig } from 'axios';

/**
 * OAuth2 client
 */
export class OAuth2 {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;

  clientId: string;
  clientSecret: string;
  scope: string;
  audience?: string;
  method?: 'BASIC_AUTH' | 'AUTH_BODY';

  constructor(
    clientId: string,
    clientSecret: string,
    scope: string,
    audience?: string,
    method?: 'BASIC_AUTH' | 'AUTH_BODY'
  ) {
    this.accessToken = '';
    this.refreshToken = '';
    this.expiresAt = 0;

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.audience = audience;
    this.method = method || 'BASIC_AUTH';
  }

  get isExpired() {
    return this.expiresAt < Date.now();
  }
  get isNotExpired() {
    return !this.isExpired;
  }
  get isRefreshable() {
    return this.refreshToken !== '';
  }

  private loadAccessToken(response: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }) {
    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.expiresAt = Date.now() + response.expires_in * 1000;
  }

  private async requestToken(payload: Record<string, string> = {}) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (this.method === 'BASIC_AUTH') {
      config.auth = {
        username: this.clientId,
        password: this.clientSecret,
      };
    } else {
      payload.client_id = this.clientId;
      payload.client_secret = this.clientSecret;
    }

    const response = await axios.post(
      `${process.env.BCC_API_URL}/oauth/token`,
      payload,
      config
    );

    this.loadAccessToken(response.data);
  }

  async requestAccessToken() {
    const payload: Record<string, string> = {
      grant_type: 'client_credentials',
    };
    if (this.scope) payload.scope = this.scope;
    if (this.audience) payload.audience = this.audience;

    return this.requestToken(payload);
  }

  async refreshAccessToken() {
    const payload: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    };
    return this.requestToken(payload);
  }

  async request(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    {body, params}: {body?: any; params?: any}
  ) {
    if (this.isExpired) {
      if (this.isRefreshable) {
        await this.refreshAccessToken();
      } else {
        await this.requestAccessToken();
      }
    }

    return axios(`${process.env.BCC_API_URL}${path}`, {
      method,
      params,
      data: body,
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async get(path: string, params: any = {}) {
    return this.request('GET', path, {params});
  }

  async post(path: string, body: any = {}, params: any = {}) {
    return this.request('POST', path, {body, params});
  }

  async patch(path: string, body: any = {}, params: any = {}) {
    return this.request('PATCH', path, {body, params});
  }

  async delete(path: string, params: any = {}) {
    return this.request('DELETE', path, {params});
  }
}
