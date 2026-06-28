type EndpointType = {
  [key: string]: string;
};

export const authEndpoints: EndpointType = {
  LOGIN: '/users/login',
  SIGNUP: '/users/register',
  ONBOARDING: '/users/onboarding',
};
