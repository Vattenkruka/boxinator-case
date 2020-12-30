
package com.example.boxinator;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

@SpringBootApplication
public class BoxinatorApplication {

    // påbörja med loadern + testa också så allt funkar i proden, skapa konto, lägg till länder osv
    // och check databasen i firebase + terminalen

    // ta bort USER i required role för /admin-dashboard + lägg till confirm-modal för add-shipment
    // och ha success meddelande sen redirect till handle-shipments och highlighta ( kolla trello)
    // ( testa också GUEST login i prod...
    // lägg till loading(vanliga spinnern), när avändaren matat in nummer och "väntar"

    public static void main(String[] args) {
        SpringApplication.run(BoxinatorApplication.class, args);
    }

    @Bean
    public void firebaseAuth()  {
        FileInputStream serviceAccount =
                null;

        try {
            serviceAccount = new FileInputStream("src/main/resources/service-account-file.json");

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);

        }

        catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
