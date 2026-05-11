package com.marcosdias.apitodo.infra.exception;

public record ErrorResponse(int status, String message) {
}
