package com.marcosdias.apitodo.infra.security;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private record Window(long start, int count) {}

    private static final int MAX_ATTEMPTS = 5;
    private static final long WINDOW_MS = 60_000L;

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();

    public boolean isAllowed(String ip) {
        long now = System.currentTimeMillis();
        Window result = windows.compute(ip, (k, w) -> {
            if (w == null || now - w.start() > WINDOW_MS) return new Window(now, 1);
            return new Window(w.start(), w.count() + 1);
        });
        return result.count() <= MAX_ATTEMPTS;
    }
}
