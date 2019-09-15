package tech.resqu.drone;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class LoginActivity extends AppCompatActivity {


    private FirebaseAuth auth;
    private FirebaseDatabase firebase;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        auth = FirebaseAuth.getInstance();
        firebase = FirebaseDatabase.getInstance();

        FirebaseUser currentUser = auth.getCurrentUser();
        if (currentUser != null) {
            auth.signOut();
        }

    }

    public void login(View view) {
        String email = ((EditText) findViewById(R.id.email)).getText().toString();
        String pw = ((EditText) findViewById(R.id.password)).getText().toString();
        final String id = ((EditText) findViewById(R.id.droneID)).getText().toString();
        //if(isEmail(email) && isPassword(pw)) {
        auth.signInWithEmailAndPassword(email, pw)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {

                            firebase.getReference("disasters").child(auth.getCurrentUser().getUid()).child("drones").child(id).addListenerForSingleValueEvent(new ValueEventListener() {
                                @Override
                                public void onDataChange(DataSnapshot dataSnapshot) {
                                    if(dataSnapshot.getValue() == null) {

                                        Log.e("drone", "NOT EXISTING");
                                    } else {
                                        Intent main = new Intent(LoginActivity.this, MainActivity.class);
                                        main.putExtra("DRONE_ID", ((EditText) findViewById(R.id.droneID)).getText().toString());
                                        startActivity(main);
                                        finish();
                                        Log.e("drone", "EXISTING");
                                    }
                                }

                                @Override
                                public void onCancelled(DatabaseError error) {

                                    Log.e("drone", "NOT EXISTING");

                                    // sign out, remove
                                }
                            });
                        } else {
                            Toast.makeText(LoginActivity.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }


}
