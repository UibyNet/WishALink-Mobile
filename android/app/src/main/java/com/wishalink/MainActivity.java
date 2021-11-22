package com.wishalink;

import android.os.Bundle;

import ch.byrds.capacitor.contacts.Contacts;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(Contacts.class);
    }
}
