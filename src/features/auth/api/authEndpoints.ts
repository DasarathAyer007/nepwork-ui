type EndpointType = {
  [key: string]: string;
};

export const authEndpoints: EndpointType = {
  LOGIN: '/users/login',
  SIGNUP: '/users/register',
  GOOGLE_LOGIN: '/users/auth/google/',
  FACEBOOK_LOGIN: '/users/auth/facebook/',
  ONBOARDING: '/users/onboarding',
  VERIFY_OTP: '/users/verify-otp',
  RESEND_OTP: '/users/resend-otp',
  LOGOUT: '/users/logout',
};
