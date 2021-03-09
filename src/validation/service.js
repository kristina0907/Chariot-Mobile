import validatejs from "validate.js";

import { validationDictionary } from "./dictionary";

export const validationService = {
  onInputChange,
};

function onInputChange({ id, value, cb = () => { } }) {
  const { inputs } = this.state;
  if (id == 'confirmPassword') {
    result = validatejs(
      {
        [id]: { confirmPassword: value, password: inputs.password.value }
      },
      {
        [id]: validationDictionary[id],
      }
    );
  } else {
    result = validatejs(
      {
        [id]: value
      },
      {
        [id]: validationDictionary[id]
      }
    );
  }


  if (result) {
    this.setState(
      {
        inputs: {
          ...inputs,
          [id]: {
            errorLabel: result[id][0]
          }
        },
        valid: true
      },
      cb
    );
  } else {
    this.setState(
      {
        inputs: {
          ...inputs,
          [id]: {
            value: value,
            errorLabel: ''
          }
        }
      },
      cb
    );

    inputs[id].errorLabel='';
    // var arg = "agreement" in inputs;
    var res = false;
    for (const [key, input] of Object.entries(inputs)) {
     
      if (input.errorLabel!=='' || input.value == '' && input.required) {
        res = false;
        break;
      } else {
        // if (arg && key == 'agreement' && input.errorLabel == '') {
        //   res = true;
        // } else if (arg && key == 'agreement' && input.errorLabel !== '') {
        //   res = false;
        // } else {
          res = true;
        // }
      }
    }


    if (res) {
      this.setState(
        {
          valid: false
        })
    } else {
      this.setState(
        {
          valid: true
        })
    }

  };
}