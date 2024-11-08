import API from "./Rule_API";

// export const = async (params) => {
//   let url = "/api/propiedades/buscar";
//   return await API.get(url, { params })
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       throw error.response.data.error || "Error precesando la solicitud";
//     });
// };


export const add = async (propiedad) => {
  return await API.post("/api/propiedades/add", propiedad)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.error;
    });
};

// export const addCarta = async (formData) => {
//   return await API.post("/api/propiedades/add/foto", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   })
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       throw error.response.data.error;
//     });
// };


export const deleteProp = async (id) => {
  let url = "/api/delete/" + id;
  return await API.delete(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error.response.data.error || "Error precesando la solicitud";
    });
};

export const modify = async (params, id) => {
  console.log(params);
  let url = "/api/editar/" + id;
  return await API.patch(url, params)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw error.response.data.error || "Error precesando la solicitud";
    });
};