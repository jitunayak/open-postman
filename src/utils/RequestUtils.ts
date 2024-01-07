export const getStatusColor = (code?: number) => {
  if (String(code).startsWith("2")) {
    return "green";
  }
  if (String(code).startsWith("4")) {
    return "red";
  }

  if (String(code).startsWith("5")) {
    return "orange";
  } else {
    return "yellow";
  }
};

export const getRequestMethodColor = (methodType: string) => {
  if (methodType === "GET") {
    return "green";
  }
  if (methodType === "POST") {
    return "yellow";
  }

  if (methodType === "PUT") {
    return "orange";
  }

  if (methodType === "DELETE") {
    return "red";
  } else {
    return "gray";
  }
};
