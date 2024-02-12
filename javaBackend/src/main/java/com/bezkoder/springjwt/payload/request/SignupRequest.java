package com.bezkoder.springjwt.payload.request;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.bezkoder.springjwt.models.ERole;

public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  private Set<String> role;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;


  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<String> getRole() {
    Set<String> roles = new HashSet<>();

    // Custom logic to assign roles based on username or email
    if (username.contains("admin") || email.contains("admin")) {
      roles.add(ERole.ROLE_ADMIN.name());
    } else if (username.contains("mod") || email.contains("mod")) {
      roles.add(ERole.ROLE_MODERATOR.name());
    } else {
      roles.add(ERole.ROLE_USER.name());
    }

    return roles;
  }

//  public void setRole(Set<String> role) {
//    this.role = role;
//  }
}
