package com.vivatech.controller.ivrportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import com.vivatech.service.JwtUserDetailsService;

import com.vivatech.config.JwtTokenUtil;
import com.vivatech.config.Response;
import com.vivatech.model.ivrportal.JwtRequest;
import com.vivatech.model.ivrportal.JwtResponse;
import com.vivatech.model.ivrportal.UserDTO;
import com.vivatech.model.ivrportal.Users;
import com.vivatech.model.ivrportal.Usersinroles;
import com.vivatech.repository.ivrportal.UsersRepository;
import com.vivatech.repository.ivrportal.RolesRepository;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@CrossOrigin
@RequestMapping(path = "/users")
public class UsersController {

    private static final Logger logger = LoggerFactory.getLogger(UsersController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public @ResponseBody
    JwtResponse createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {

        JwtResponse response;
        
        try {
            authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());

            final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());

            final String token = jwtTokenUtil.generateToken(userDetails);

            UserDTO userdto = getCurrentUserDTO(authenticationRequest.getUsername());
            response = new JwtResponse(token, userdto, "");

        } catch (Exception e) {
            //TODO: handle exception
            response = new JwtResponse("", null, e.getMessage());
            logger.error("createAuthenticationToken : " + e.getMessage());
        }

        return response;
    }

    UserDTO getCurrentUserDTO(String username) {
        List<Object[]> objlist = usersRepository.getUserAndRoleDetailsFromUsername(username);

        UserDTO oUserDTO = new UserDTO();
        if (objlist != null) {
            Object[] obj = objlist.get(0);
            oUserDTO.setId((String) obj[0]);
            oUserDTO.setUsername((String) obj[1]);
            oUserDTO.setPassword((String) obj[2]);
            oUserDTO.setFirstname((String) obj[3]);
            oUserDTO.setLastname((String) obj[4]);
            oUserDTO.setEmail((String) obj[5]);
            oUserDTO.setPhonenumber((String) obj[6]);
            oUserDTO.setStatus((String) obj[7]);
            oUserDTO.setRolename((String) obj[8]);
        }

        return oUserDTO;
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }

    @RequestMapping(value = "/reauthenticate", method = RequestMethod.POST)
    public @ResponseBody
    JwtResponse ReAuthenticationToken() throws Exception {
        JwtResponse response;
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            String username = userDetails.getUsername();
            logger.warn(username);

            //authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
            //final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
            final String token = jwtTokenUtil.generateToken(userDetails);

            UserDTO userdto = getCurrentUserDTO(username);
            response = new JwtResponse(token, userdto, "");

        } catch (Exception e) {
            //TODO: handle exception
            response = new JwtResponse("", null, e.getMessage());
            logger.error("createAuthenticationToken : " + e.getMessage());
        }
        return response;
    }

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder bcryptEncoder;

    @PostMapping(path = "/add") // Map ONLY POST Requests
    public @ResponseBody
    Response addNewUsers(@RequestBody UserDTO in) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        try {
            // Create new user
            Users n = new Users();
            UUID uuid = UUID.randomUUID();

            n.setId(uuid.toString());// set unique id
            n.setEmail(in.getEmail());
            n.setFirstname(in.getFirstname());
            n.setLastname(in.getLastname());
            n.setPasswordhash(bcryptEncoder.encode(in.getPassword()));
            n.setPhonenumber(in.getPhonenumber());
            n.setUsername(in.getUsername());
            n.setStatus(in.getStatus());

            usersRepository.save(n);

        } catch (Exception e) {
            // TODO: handle exception
            return new Response("", e.getMessage());
        }

        return new Response("SUCCESS", "");
    }

    // @GetMapping(path = "/all")
    // public @ResponseBody Iterable<Users> getAllUsers() {
    //   // This returns a JSON or XML with the users
    //   return usersRepository.findAll();
    // }

    @PostMapping(path = "/update") // Map ONLY POST Requests
    public @ResponseBody
    Response updateUsers(@RequestBody UserDTO in) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestBody means it is a parameter from the GET or POST request

        try {
            Users n = usersRepository.findByUsername(in.getUsername());

            n.setEmail(in.getEmail());
            n.setFirstname(in.getFirstname());
            n.setLastname(in.getLastname());
            if (n.getPasswordhash().equalsIgnoreCase(in.getPassword())) {//update only if password field is changed
                n.setPasswordhash(bcryptEncoder.encode(in.getPassword()));
            }

            n.setPhonenumber(in.getPhonenumber());
            n.setStatus(in.getStatus());

            // TO DO : role name
            // TO DO :associated userid
            usersRepository.save(n);

        } catch (Exception e) {
            //TODO: handle exception
            return new Response("", e.getMessage());
        }

        return new Response("SUCCESS", "");
    }

    @PostMapping(path = "/delete") // Map ONLY POST Requests
    @Transactional
    public @ResponseBody
    Response deleteUsers(@RequestBody String userid) {

        try {
            // users
            usersRepository.deleteById(userid);

        } catch (Exception e) {
            //TODO: handle exception
            return new Response("", e.getMessage());
        }

        return new Response("SUCCESS", "");
    }

}
