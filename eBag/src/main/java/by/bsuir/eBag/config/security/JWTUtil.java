package by.bsuir.eBag.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.Date;

@Component
public class JWTUtil {

    private static final String USERNAME_CLAIM = "username";
    private static final String ISSUER = "eBag";
    private static final String USER_DETAILS_SUBJECT = "User details";
    private static final String ID_CLAIM = "id";
    private static final String ROLE_CLAIM = "role";
    private static final int MINUTES = 60;

    @Value("${jwt_secret}")
    private String secret;

    public String generateToken(String username, int id, String role) {
        Date expirationDate = Date.from(ZonedDateTime.now().plusMinutes(MINUTES).toInstant());

        return JWT.create()
                .withSubject(USER_DETAILS_SUBJECT)
                .withClaim(USERNAME_CLAIM, username)
                .withClaim(ID_CLAIM, id)
                .withClaim(ROLE_CLAIM, role)
                .withIssuedAt(new Date())
                .withIssuer(ISSUER)
                .withExpiresAt(expirationDate)
                .sign(Algorithm.HMAC256(secret));
    }

    public String validateTokenAndRetrieveClaim(String token) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject(USER_DETAILS_SUBJECT)
                .withIssuer(ISSUER)
                .build();

        DecodedJWT jwt = verifier.verify(token);
        return jwt.getClaim(USERNAME_CLAIM).asString();
    }

}