export const NUMBER_REGEX = /^\d+$/;

export const STRING_REGEX = /^[a-zA-Z]+$/;

export const DOMAIN_NAME_REGEX =
  /^(?<domain>(?<domain_sub>(?:[^\/\"\]:\.\s\|\-][^\/\"\]:\.\s\|]*?\.)*?)(?<domain_root>[^\/\"\]:\s\.\|\n]+\.(?<domain_tld>(?:xn--)?[\w-]{2,7}(?:\.[a-zA-Z-]{2,3})*)))$/;

export const EMAIL_REGEX =
  /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[*[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+]*/;

export const PHONE_REGEX = /^[0-9]{10}$/;

export const CATEGORY_REGEX = /^[\sa-zA-Z]+$/;

export const SLUG_REGEX = /^[-a-z]+$/;
