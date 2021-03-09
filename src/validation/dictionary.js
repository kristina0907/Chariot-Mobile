import translate from '../translations/translations';

export const validationDictionary = {
  email: {
    email: {
      message: "^"+translate("emailNotCompliant")
    },
    length: {
      maximum: 100,
      message: "^"+translate("emailNotExceedCharacters")
    }
  },
  name: {
    presence: {
      allowEmpty: false,
      message: "^"+translate("loginBlank")
    }
  },
  oldpassword: {
    presence: {
      allowEmpty: false,
      message: "^"+translate("oldPasswordBlank")
    }
  },
  password: {
    presence: {
      allowEmpty: true,
      message: "^"+translate("passwordBlank")
    },
    format: {
      pattern: /^(?=^.{6,15}$)(?=.*\d)(?=.*[a-z]||[A-Z])(?!.*\s).*$/,
      message: "^"+translate("passwordCharacters")
    },
  },
  confirmPassword: {
    presence: {
      allowEmpty: true,
      message: "^"+translate("confirmPassword")
    },
    equality: {
      attribute: 'password',
      message: "^"+translate("passwordsNotMatch"),
      comparator: function(v1) {
        return v1.confirmPassword === v1.password;
      }
    }
  },
  username: {
    presence: {
      allowEmpty: false,
      message: "^"+translate("nameBlank")
    },
    length: {
      minimum: 2,
      maximum: 100,
      message: "^"+translate("nameCharacters")
    }
  },
  surName: {
    presence: {
      allowEmpty: false,
      message: "^"+translate("lastNameEmpty")
    },
    length: {
      minimum: 2,
      maximum: 100,
      message: "^"+translate("surnameCharacters")
    }
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "^"+translate("phoneEmpty")
    },
    // length: {
    //   minimum: 18,
    //   message: "^Телефон введен неправильно"
    // }
  },
    agreement:{
      presence: {
        message: "^"+translate("acceptUserAgreement")
      },
      inclusion: {
        within: [true],
        message: "^"+translate("acceptUserAgreement")
      }
  }
};