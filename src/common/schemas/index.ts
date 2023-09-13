import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
  phone: yup
    .string()
    .matches(
      /(?:12|51|50|55|70|77)[^w]{0,2}[2-9][0-9]{2}[^w]{0,2}[0-9]{2}[^w]{0,2}[0-9]{2}/
    )
    .required(),
});
