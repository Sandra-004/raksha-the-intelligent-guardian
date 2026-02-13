import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

export default function App() {
    const [f, setf] = useState(false);
    const [b, setb] = useState(false);

    function press() {
        if (f == true) {
            setf(false)
        } else {
            setf(true)
        }
    }

    function big() {
        if (f == true) {
            console.log("sos")
            setb(true)
            setTimeout(() => {
                setb(false)
            }, 2000);
        }
    }

    return (
        <View style={styles.c}>
            <View style={styles.top}>
                <Text style={styles.t1}>RAKSHA</Text>
                <Text style={styles.t2}>The Intelligent Guardian</Text>
            </View>

            <View style={styles.mid}>
                <Text style={styles.l}>GUARD MODE</Text>
                <TouchableOpacity onPress={press} style={f ? styles.on : styles.off}>
                    <View style={f ? styles.cir_on : styles.cir_off}></View>
                </TouchableOpacity>
                <Text style={f ? styles.s_on : styles.s_off}>{f ? "ARMED" : "STANDBY"}</Text>
            </View>

            <View style={styles.bot}>
                {f ?
                    <TouchableOpacity onPress={big} style={styles.red}>
                        <View style={styles.b2}>
                            <Text style={styles.sos}>SOS</Text>
                            {b ? <Text style={styles.rec}>RECORDING</Text> : null}
                        </View>
                    </TouchableOpacity>
                    :
                    <Text style={styles.warn}>ACTIVATE GUARD MODE FIRST</Text>
                }
            </View>

            <View style={styles.f}>
                <Text style={styles.ft}>{f ? "Protected - System Active" : "Activate Guard Mode to enable protection"}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    c: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    top: {
        marginTop: 50,
        alignItems: 'center',
    },
    t1: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
        letterSpacing: 5
    },
    t2: {
        color: '#888',
        fontSize: 12,
        marginTop: 5
    },
    mid: {
        marginTop: 60,
        alignItems: 'center'
    },
    l: {
        color: '#888',
        fontSize: 14,
        marginBottom: 10
    },
    off: {
        width: 80,
        height: 40,
        backgroundColor: '#555',
        borderRadius: 20,
        justifyContent: 'center',
        padding: 2
    },
    on: {
        width: 80,
        height: 40,
        backgroundColor: 'red',
        borderRadius: 20,
        justifyContent: 'center',
        padding: 2
    },
    cir_off: {
        width: 36,
        height: 36,
        backgroundColor: '#fff',
        borderRadius: 18
    },
    cir_on: {
        width: 36,
        height: 36,
        backgroundColor: '#fff',
        borderRadius: 18,
        alignSelf: 'flex-end'
    },
    s_on: {
        color: 'red',
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    s_off: {
        color: '#888',
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    bot: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    red: {
        width: 250,
        height: 250,
        backgroundColor: 'red',
        borderRadius: 125,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
    },
    b2: {
        alignItems: 'center'
    },
    sos: {
        color: '#fff',
        fontSize: 60,
        fontWeight: 'bold'
    },
    warn: {
        color: '#555'
    },
    f: {
        marginBottom: 20
    },
    ft: {
        color: '#555'
    },
    rec: {
        color: 'white',
        marginTop: 10,
        fontWeight: 'bold'
    }
});
