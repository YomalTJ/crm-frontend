/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";

export interface GrantUtilizationPayload {
  hhNumberOrNic: string; // Required field (not nullable)

  districtId?: string | null;
  dsId?: string | null;
  zoneId?: string | null;
  gndId?: string | null;

  // Basic grant information (required fields)
  amount: number;
  grantDate: string;

  financialAid?: number | null;
  interestSubsidizedLoan?: number | null;
  samurdiBankLoan?: number | null;

  // Livelihood/Self-employment section (nullable optional fields)
  purchaseDate?: string | null;
  equipmentPurchased?: string | null;
  animalsPurchased?: string | null;
  plantsPurchased?: string | null;
  othersPurchased?: string | null;
  projectStartDate?: string | null;

  // Employment/Training section (nullable optional fields)
  employmentOpportunities?: string | null;
  traineeName?: string | null;
  traineeAge?: number | null;
  traineeGender?: string | null;
  courseName?: string | null;
  institutionName?: string | null;
  courseFee?: number | null;
  courseDuration?: string | null;
  courseStartDate?: string | null;
  courseEndDate?: string | null;
}

export interface GrantUtilizationResponse {
  id: string;
  amount: number;
  grantDate: string;
  purchaseDate?: string;
  equipmentPurchased?: string;
  animalsPurchased?: string;
  plantsPurchased?: string;
  othersPurchased?: string;
  projectStartDate?: string;
  employmentOpportunities?: string;
  traineeName?: string;
  traineeAge?: number;
  traineeGender?: string;
  courseName?: string;
  institutionName?: string;
  courseFee?: number;
  courseDuration?: string;
  courseStartDate?: string;
  courseEndDate?: string;
  samurdhiFamily: {
    id: string;
    beneficiaryName: string;
    nic: string;
    address: string;
  };
  district: {
    district_id: string;
    name: string;
  };
  divisionalSecretariat: {
    ds_id: string;
    name: string;
  };
  gramaNiladhariDivision: {
    gnd_id: string;
    name: string;
  };
  samurdhiBank: {
    zone_id: string;
    name: string;
  };
}

const requestQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void; fn: () => Promise<any> }> = [];
let processing = false;
const MAX_CONCURRENT_REQUESTS = 5;
const REQUEST_DELAY = 1000; // 1 second between batches

async function processQueue() {
  if (processing || requestQueue.length === 0) return;

  processing = true;

  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, MAX_CONCURRENT_REQUESTS);
    const promises = batch.map(({ fn, resolve, reject }) =>
      fn().then(resolve).catch(reject)
    );

    await Promise.all(promises);

    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
    }
  }

  processing = false;
}

function queuedRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, fn });
    processQueue();
  });
}

export const createGrantUtilization = async (payload: GrantUtilizationPayload): Promise<GrantUtilizationResponse> => {
  return queuedRequest(async () => {
    // Validate payload size before sending
    if (JSON.stringify(payload).length > 10000) {
      throw new Error('Request payload too large');
    }

    try {
      const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/grant-utilization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create Grant Utilization record');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create Grant Utilization record');
    }
  });
};

export const getGrantUtilizationById = async (id: string): Promise<GrantUtilizationResponse> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/grant-utilization/${id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch Grant Utilization details');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch Grant Utilization details');
  }
};

export const updateGrantUtilization = async (hhNumberOrNic: string, payload: GrantUtilizationPayload): Promise<GrantUtilizationResponse> => {
  return queuedRequest(async () => {
    if (JSON.stringify(payload).length > 10000) {
      throw new Error('Request payload too large');
    }
    try {
      const token = (await cookies()).get('accessToken')?.value ||
        (await cookies()).get('staffAccessToken')?.value;

      if (!token) {
        throw new Error('No authentication token found');
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/grant-utilization/${hhNumberOrNic}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'x-app-key': process.env.APP_AUTH_KEY!
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update Grant Utilization record');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update Grant Utilization record');
    }
  });
};

export const getAllGrantUtilizations = async (filters?: any): Promise<GrantUtilizationResponse[]> => {
  try {
    const token = (await cookies()).get('accessToken')?.value ||
      (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
    }

    const queryString = params.toString();
    const url = `${baseUrl}/api/grant-utilization${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch Grant Utilization records');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch Grant Utilization records');
  }
};

export const checkGrantUtilizationExists = async (hhNumberOrNic: string): Promise<boolean> => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/grant-utilization/family/${hhNumberOrNic}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return false;
      }
      const error = await response.json();
      throw new Error(error.error || 'Failed to check Grant Utilization existence');
    }

    const data = await response.json();
    // If we get a successful response and there are grant utilizations, return true
    return data.grantUtilizations && data.grantUtilizations.length > 0;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to check Grant Utilization existence');
  }
};

export const getGrantUtilizationsByHhNumberOrNic = async (hhNumberOrNic: string): Promise<any> => {
  try {
    const token = (await cookies()).get('accessToken')?.value || (await cookies()).get('staffAccessToken')?.value;

    if (!token) {
      throw new Error('No authentication token found');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/grant-utilization/family/${hhNumberOrNic}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${token}`,
        'x-app-key': process.env.APP_AUTH_KEY!
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch Grant Utilization records');
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch Grant Utilization records');
  }
};