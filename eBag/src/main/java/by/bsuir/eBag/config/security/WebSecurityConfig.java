package by.bsuir.eBag.config.security;

import by.bsuir.eBag.service.UserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JWTFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                                auth
                                        .requestMatchers(
                                                "/auth/registration",
                                                "/auth/login",
                                                "swagger-ui/**",
                                                "/v3/**",
                                                "/error",
                                                "/api/products"
                                        )
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated()
                                /*.requestMatchers("/api/**").hasAnyRole("ADMIN")
                                .requestMatchers("/api/bucket").hasAnyRole("USER")
                                .requestMatchers("/api/address").hasAnyRole("USER")
                                .requestMatchers("/api/users/**").hasAnyRole("USER")
                                .anyRequest().permitAll()*/

                )
                .formLogin(login -> login.permitAll()
                        .loginPage("/auth/login")
                        .loginProcessingUrl("/process_login")
                        .failureUrl("/auth/login?error"))
                .logout(out -> out.logoutUrl("/logout")
                        .logoutSuccessUrl("/auth/login"))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).configure(auth);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
