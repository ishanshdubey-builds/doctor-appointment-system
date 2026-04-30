package com.das.pro.dasprorestjpa;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LoginRepo loginRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 🔥 CRITICAL FIX — ALLOW PREFLIGHT (CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;
        String role = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                role = jwtUtil.extractRole(token);
            } catch (Exception e) {
                logger.error("JWT Validation failed: " + e.getMessage());
            }
        }

        if (username != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserInfoEntity userDetails = loginRepo.findById(username).orElse(null);

            if (userDetails != null && jwtUtil.validateToken(token, userDetails.getUser_id())) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, Collections.singletonList(authority));

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    // @Override
    // protected void doFilterInternal(HttpServletRequest request,
    // HttpServletResponse response, FilterChain filterChain)
    // throws ServletException, IOException {
    // String authHeader = request.getHeader("Authorization");
    // String token = null;
    // String username = null;
    // String role = null;

    // if (authHeader != null && authHeader.startsWith("Bearer ")) {
    // token = authHeader.substring(7);
    // try {
    // username = jwtUtil.extractUsername(token);
    // role = jwtUtil.extractRole(token);
    // } catch (Exception e) {
    // logger.error("JWT Validation failed: " + e.getMessage());
    // }
    // }

    // if (username != null && role != null &&
    // SecurityContextHolder.getContext().getAuthentication() == null) {
    // UserInfoEntity userDetails = loginRepo.findById(username).orElse(null);

    // if (userDetails != null && jwtUtil.validateToken(token,
    // userDetails.getUser_id())) {
    // SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" +
    // role.toUpperCase());

    // UsernamePasswordAuthenticationToken authToken = new
    // UsernamePasswordAuthenticationToken(
    // userDetails, null, Collections.singletonList(authority));

    // authToken.setDetails(new
    // WebAuthenticationDetailsSource().buildDetails(request));
    // SecurityContextHolder.getContext().setAuthentication(authToken);
    // }
    // }
    // filterChain.doFilter(request, response);
    // }
}

// package com.das.pro.dasprorestjpa;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.beans.factory.annotation.Autowired;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import
// org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.ArrayList;

// @Component
// public class JwtAuthFilter extends OncePerRequestFilter {

// @Autowired
// private JwtUtil jwtUtil;

// @Autowired
// private LoginRepo loginRepo;

// @Override
// protected void doFilterInternal(HttpServletRequest request,
// HttpServletResponse response, FilterChain filterChain)
// throws ServletException, IOException {
// String authHeader = request.getHeader("Authorization");
// String token = null;
// String username = null;

// if (authHeader != null && authHeader.startsWith("Bearer ")) {
// token = authHeader.substring(7);
// try {
// username = jwtUtil.extractUsername(token);
// } catch (Exception e) {
// // Ignore invalid tokens and leave context empty
// }
// }

// if (username != null &&
// SecurityContextHolder.getContext().getAuthentication() == null) {
// UserInfoEntity userDetails = loginRepo.findById(username).orElse(null);

// if (userDetails != null && jwtUtil.validateToken(token,
// userDetails.getUser_id())) {
// UsernamePasswordAuthenticationToken authToken = new
// UsernamePasswordAuthenticationToken(
// userDetails, null, new ArrayList<>());
// authToken.setDetails(new
// WebAuthenticationDetailsSource().buildDetails(request));
// SecurityContextHolder.getContext().setAuthentication(authToken);
// }
// }
// filterChain.doFilter(request, response);
// }
// }
