import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';

type TaskCompletedNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskCompleted'
>;

const TaskCompletedScreen: React.FC = () => {
  const navigation = useNavigation<TaskCompletedNavigationProp>();

  const [amountReceived, setAmountReceived] = useState('');
  const [amountReturned, setAmountReturned] = useState('');
  const [vendorDetails, setVendorDetails] = useState('');
  const [receiptName, setReceiptName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const received = Number(amountReceived) || 0;
  const returned = Number(amountReturned) || 0;

  const netAmount = Math.max(received - returned, 0);

  /*
   * Go to Home screen.
   *
   * Main is the bottom-tab navigator, so navigating to Main
   * takes the user back to the Home tab.
   */
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
        },
      ],
    });
  };

  /*
   * RECEIPT
   *
   * This keeps your current UI behavior.
   * Replace this function later with the actual
   * image picker / receipt upload API.
   */
  const handleReceiptUpload = () => {
    setReceiptName('receipt.jpg');
  };

  /*
   * SUBMIT TASK
   *
   * Shows confirmation first.
   * YES -> Home
   * NO -> stays on this screen
   */
  const handleSubmit = () => {
    if (submitting) {
      return;
    }

    Alert.alert(
      'Submit Task',
      'Are you sure you want to submit this task?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setSubmitting(true);

            /*
             * Here you can later call your backend API.
             *
             * For now, after successful submission,
             * return to Home.
             */
            setTimeout(() => {
              setSubmitting(false);
              goToHome();
            }, 300);
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  /*
   * CANCEL TASK
   *
   * YES -> Home
   * NO -> stays on this screen
   */
  const handleCancelTask = () => {
    Alert.alert(
      'Cancel Task',
      'Are you sure you want to cancel this task?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            goToHome();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Task Completed</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {/* COMPLETED HEADER */}
        <View style={styles.completedHeader}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>

          <View style={styles.completedInfo}>
            <Text style={styles.completedTitle}>
              Task Completed
            </Text>

            <Text style={styles.completedSubtitle}>
              Please enter the task details
            </Text>
          </View>
        </View>

        {/* MAIN FORM CARD */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            COMPLETION DETAILS
          </Text>

          {/* STATUS + DISTANCE */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Status
              </Text>

              <View style={styles.statusField}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  COMPLETED
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Distance
              </Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  523.58 m
                </Text>
              </View>
            </View>
          </View>

          {/* DURATION + AMOUNT RECEIVED */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Duration
              </Text>

              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  2 seconds
                </Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Amount Received
              </Text>

              <TextInput
                style={styles.input}
                value={amountReceived}
                onChangeText={setAmountReceived}
                placeholder="Enter amount"
                placeholderTextColor="#A0A0A0"
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* AMOUNT RETURNED + NET AMOUNT */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Amount Returned
              </Text>

              <TextInput
                style={styles.input}
                value={amountReturned}
                onChangeText={setAmountReturned}
                placeholder="Enter amount"
                placeholderTextColor="#A0A0A0"
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Net Amount
              </Text>

              <View style={styles.netField}>
                <Text style={styles.netText}>
                  Rs. {netAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* VENDOR DETAILS */}
          <View style={styles.fullField}>
            <Text style={styles.label}>
              Vendor Details
            </Text>

            <TextInput
              style={styles.vendorInput}
              value={vendorDetails}
              onChangeText={setVendorDetails}
              placeholder="Enter vendor name and invoice details"
              placeholderTextColor="#A0A0A0"
              multiline={false}
            />
          </View>

          {/* RECEIPT */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptInfo}>
              <Text style={styles.label}>
                Receipt
              </Text>

              <Text style={styles.receiptDescription}>
                JPEG, PNG, WebP or PDF • Max 5 MB
              </Text>

              {receiptName !== '' && (
                <Text style={styles.fileName}>
                  ✓ {receiptName}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.uploadButton}
              activeOpacity={0.8}
              onPress={handleReceiptUpload}>
              <Text style={styles.uploadIcon}>
                ↑
              </Text>

              <Text style={styles.uploadText}>
                {receiptName ? 'CHANGE' : 'UPLOAD'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonsContainer}>
          {/* SUBMIT TASK */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={submitting}>
            <Text style={styles.submitText}>
              {submitting ? 'SUBMITTING...' : 'SUBMIT TASK'}
            </Text>
          </TouchableOpacity>

          {/* CANCEL TASK */}
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={handleCancelTask}
            disabled={submitting}>
            <Text style={styles.cancelText}>
              CANCEL TASK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F7',
  },

  /* HEADER */

  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backArrow: {
    fontSize: 34,
    color: '#333333',
    lineHeight: 38,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#222222',
  },

  headerSpacer: {
    width: 42,
  },

  /* CONTENT */

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  /* COMPLETED HEADER */

  completedHeader: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  checkMark: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
  },

  completedInfo: {
    justifyContent: 'center',
  },

  completedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
  },

  completedSubtitle: {
    fontSize: 11,
    color: '#888888',
    marginTop: 3,
  },

  /* FORM CARD */

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5DCDC',
    padding: 15,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },

  formTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C7193F',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  /* ROW */

  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 11,
  },

  field: {
    flex: 1,
  },

  fullField: {
    marginBottom: 11,
  },

  /* LABEL */

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 5,
  },

  /* STATUS */

  statusField: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BCE8C9',
    backgroundColor: '#EFFAF2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 7,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16803B',
  },

  /* READ ONLY */

  readOnlyField: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    paddingHorizontal: 11,
  },

  readOnlyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },

  /* INPUT */

  input: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    fontSize: 12,
    color: '#222222',
  },

  /* NET */

  netField: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7B8C1',
    backgroundColor: '#FFF1F3',
    justifyContent: 'center',
    paddingHorizontal: 11,
  },

  netText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C7193F',
  },

  /* VENDOR */

  vendorInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CFCFCF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 11,
    fontSize: 12,
    color: '#222222',
  },

  /* RECEIPT */

  receiptSection: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  receiptInfo: {
    flex: 1,
  },

  receiptDescription: {
    fontSize: 9,
    color: '#888888',
    marginTop: 1,
  },

  fileName: {
    fontSize: 10,
    color: '#16803B',
    fontWeight: '700',
    marginTop: 4,
  },

  uploadButton: {
    width: 90,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FCE8EC',
    borderWidth: 1,
    borderColor: '#E9B8C2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  uploadIcon: {
    color: '#C7193F',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 4,
  },

  uploadText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C7193F',
  },

  /* BUTTONS */

  buttonsContainer: {
    marginTop: 12,
  },

  submitButton: {
    height: 50,
    borderRadius: 9,
    backgroundColor: '#C7193F',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#8F102D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
  },

  cancelButton: {
    height: 42,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#C7193F',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  cancelText: {
    color: '#C7193F',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default TaskCompletedScreen;