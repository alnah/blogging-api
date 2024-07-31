const validator = require("validator");

const socialMediaValidator = {
  facebook: {
    validator: (v) =>
      validator.isURL(v, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      }) && /facebook\.com\/[A-Za-z0-9.]{5,50}/.test(v),
    message: (props) => `${props.value} is not a valid Facebook URL.`,
  },

  instagram: {
    validator: (v) =>
      validator.isURL(v, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      }) && /instagram\.com\/[A-Za-z0-9_.]{1,30}/.test(v),
    message: (props) => `${props.value} is not a valid Instagram URL.`,
  },

  tiktok: {
    validator: (v) =>
      validator.isURL(v, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      }) && /tiktok\.com\/[A-Za-z0-9_]{1,24}/.test(v),
    message: (props) => `${props.value} is not a valid TikTok URL.`,
  },

  x: {
    validator: (v) =>
      validator.isURL(v, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      }) && /twitter\.com\/[A-Za-z0-9_]{1,15}/.test(v),
    message: (props) => `${props.value} is not a valid X URL.`,
  },

  linkedin: {
    validator: (v) =>
      validator.isURL(v, {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      }) && /linkedin\.com\/in\/[A-Za-z0-9-]{5,30}/.test(v),
    message: (props) => `${props.value} is not a valid LinkedIn URL.`,
  },
};

module.exports = socialMediaValidator;
