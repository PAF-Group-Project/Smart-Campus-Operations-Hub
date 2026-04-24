package com.groupxx.smartcampus.config;

import com.groupxx.smartcampus.preferences.NotificationPreferences;
import com.groupxx.smartcampus.user.Role;
import com.groupxx.smartcampus.user.User;
import com.groupxx.smartcampus.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);

            String provider = userRequest.getClientRegistration().getRegistrationId();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String avatar = (String) attributes.get("picture");
            String googleId = (String) attributes.get("sub");

            if (email == null || email.isBlank()) {
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("invalid_user_info"),
                        "Google response did not include a valid email"
                );
            }

            String normalizedEmail = email.toLowerCase(Locale.ROOT);
            Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

            User user;
            if (userOptional.isPresent()) {
                user = userOptional.get();
                user.setName(name);
                user.setAvatar(avatar);
                user.setGoogleId(googleId);
                if (user.getProvider() == null || !"local".equalsIgnoreCase(user.getProvider())) {
                    user.setProvider(provider);
                }
                if (user.getNotificationPreferences() == null) {
                    user.setNotificationPreferences(NotificationPreferences.defaultPreferences());
                }
            } else {
                user = User.builder()
                        .email(normalizedEmail)
                        .name(name)
                        .avatar(avatar)
                        .googleId(googleId)
                        .provider(provider)
                        .role(Role.USER) // Default role
                        .notificationPreferences(NotificationPreferences.defaultPreferences())
                        .build();
            }

            userRepository.save(user);
            return oAuth2User;
        } catch (OAuth2AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_persistence_failed"),
                    "Failed to process OAuth2 user profile",
                    ex
            );
        }
    }
}
