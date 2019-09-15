package com.example.resqutech;

import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.util.List;

public class MainActivity extends AppCompatActivity {
    WifiManager wifiManager;
    String droneSSID;
    Toast  connectionMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView myWebView = (WebView) findViewById(R.id.webview);

        wifiManager= (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        WifiInfo info = wifiManager.getConnectionInfo ();
        //SSID String
        droneSSID= info.getSSID();
        //The Drone's SSID

        //Enabling Javascript
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        //passes the value to the URL
        myWebView.loadUrl("http://example.com/#droneSSID");

        BroadcastReceiver wifiScanReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent intent) {
                boolean success = intent.getBooleanExtra(
                        WifiManager.EXTRA_RESULTS_UPDATED, false);
                if (success) {
                    scanSuccess();
                    //outputs the SSID
                   // System.out.println(droneSSID);
                } else {
                    // scan failure handling
                    scanFailure();
                }
            }
        };

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION);
        getApplicationContext().registerReceiver(wifiScanReceiver, intentFilter);

        boolean success = wifiManager.startScan();
        if (!success) {
            // scan failure handling
            scanFailure();
        }

    }
    //Request the wifi connections at runtime
    @Override
    public void onResume()
    {
        super.onResume();

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
        {
            if(checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION)
                    != PackageManager.PERMISSION_GRANTED)
            {
                requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION},
                        87);
            }
        }
    }

    private void scanSuccess(){
        List<ScanResult> results = wifiManager.getScanResults();
       System.out.println("Available Networks");
       String dSSID=droneSSID.replace("\"","");
        for (ScanResult scanResult : results) {
            System.out.println("SSID:"+scanResult.SSID);
            if(scanResult.SSID.equals(dSSID)){
                System.out.println("Connected to the right Wifi Network!");
                connectionMessage=Toast.makeText
                        (getApplicationContext(),"Connected to Drone!", Toast.LENGTH_LONG);
                connectionMessage.show();
                break;
            }
            else{
                System.out.println(scanResult.SSID + " - " + scanResult.capabilities);
                //System.out.println(scanResult.SSID);
            }
        }

    }

    private void scanFailure(){
        // handle failure: new scan did NOT succeed
        // consider using old scan results: these are the OLD results!
        List<ScanResult> results = wifiManager.getScanResults();
    }


}
