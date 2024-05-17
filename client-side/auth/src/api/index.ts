import request from "@/utils/request.ts";
import { query } from "express-validator";

interface AuthorizeType {
  email: string;
  password: string;
}

export function login(data: AuthorizeType) {
  return request("/api/oauth2/login", {
    method: "POST",
    data,
  });
}

interface DecisionType {
  transaction_id: string;
  decision: string;
}

export function decision(data: DecisionType) {
  return request("/api/oauth2/decision", {
    method: "POST",
    data,
  });
}

export function authorize(params) {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/oauth2/authorize?${queryString}`;
  return request({
    url,
    method: "get",
  });
}
