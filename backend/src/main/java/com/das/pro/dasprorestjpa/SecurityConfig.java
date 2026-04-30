package com.das.pro.dasprorestjpa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    // 🔐 Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Authentication manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 🔥 MAIN SECURITY CONFIG (FIXED)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                // ✅ Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ Stateless (JWT)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // ✅ AUTH RULES
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // 🔥 VERY IMPORTANT
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/checkuserId/**").permitAll()
                        .requestMatchers("/signupdata").permitAll() // (if you use it)
                        .anyRequest().authenticated())

                // ✅ JWT FILTER
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔥 CORS CONFIG (FULL FIX)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Allow ALL origins (safe for now, later restrict)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // ✅ Allow all methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Allow ALL headers (important fix)
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // ✅ Allow credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

// package com.das.pro.dasprorestjpa;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import
// org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import
// org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import java.util.Arrays;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

// @Autowired
// private JwtAuthFilter jwtAuthFilter;

// @Bean
// public PasswordEncoder passwordEncoder() {
// return new BCryptPasswordEncoder();
// }

// @Bean
// public AuthenticationManager
// authenticationManager(AuthenticationConfiguration authConfig) throws
// Exception {
// return authConfig.getAuthenticationManager();
// }

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http
// .csrf(csrf -> csrf.disable())
// .cors(cors -> cors.configurationSource(corsConfigurationSource()))
// .sessionManagement(sess ->
// sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/auth/**").permitAll()
// .requestMatchers("/checkuserId").permitAll()
// .anyRequest().authenticated())
// .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
// return http.build();
// }

// @Bean
// public CorsConfigurationSource corsConfigurationSource() {
// CorsConfiguration configuration = new CorsConfiguration();
// configuration.setAllowedOriginPatterns(Arrays.asList("*"));
// configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE",
// "OPTIONS"));
// configuration.setAllowedHeaders(Arrays.asList("Authorization",
// "Cache-Control", "Content-Type"));
// configuration.setAllowCredentials(true);
// UrlBasedCorsConfigurationSource source = new
// UrlBasedCorsConfigurationSource();
// source.registerCorsConfiguration("/**", configuration);
// return source;
// }
// }

// package com.das.pro.dasprorestjpa;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import
// org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.web.SecurityFilterChain;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

// @Autowired
// private JwtAuthFilter jwtAuthFilter;

// @Bean
// public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
// Exception {
// http
// .csrf(csrf -> csrf.disable())
// .cors(cors -> {}) // rely on generic cors config or default
// .authorizeHttpRequests(auth -> auth
// .requestMatchers("/auth/**").permitAll()
// .requestMatchers("/signupdata").permitAll() // keep signup testable without
// auth
// .requestMatchers("/checkuserId").permitAll()
// .anyRequest().authenticated()
// )
// .sessionManagement(sess ->
// sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
// .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

// return http.build();
// }
// }
