const jpdbBaseUrl = 'http://api.login2explore.com:5577';
const jpdbIrl = '/api/irl';
const jpdbIml = '/api/iml';
const studDbName = "SCHOOL-DB";
const studRelName = "STUDENT-TABLE";
const connToken = "90931473|-31949303151979957|90960610";
const primaryKeyName = "rollNo";

        $(document).ready(function () {
            resetStudForm();
        });

        function resetStudForm() {
            // Step 2: Disable all buttons and form fields
            $('#save').prop('disabled', true);
            $('#update').prop('disabled', true);
            $('#reset').prop('disabled', true);
            $('input, select, textarea').prop('disabled', true);

            // Enable and focus on the primary key field
            $('#' + primaryKeyName).prop('disabled', false).focus();
        }

        function getStud() {
            var studIdJsonObj = getStudIdAsJsonObj();
            var getRequest = createGET_By_KeyRequest(connToken, studDbName, studRelName, studIdJsonObj);
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIrl);
            jQuery.ajaxSetup({ async: true });

            // Check if the primary key exists in the database
            if (resJsonObj.status === 400) {
                // Primary key does not exist, enable [Save] and [Reset], move to the next field
                $('#save').prop('disabled', false);
                $('#reset').prop('disabled', false);
                $('input, select, textarea').prop('disabled', false);
                $('#' + primaryKeyName).prop('disabled', true);  // Disable primary key field

                // Move cursor to the next field
                var nextInput = $('#' + primaryKeyName).closest('.form-group').next().find('input, select, textarea').first();
                nextInput.focus();
            } else if (resJsonObj.status === 200) {
                // Primary key exists, enable [Update] and [Reset], move to the next field
                $('#update').prop('disabled', false);
                $('#reset').prop('disabled', false);
                $('input, select, textarea').prop('disabled', false);

                // Move cursor to the next field
                var nextInput = $('#' + primaryKeyName).closest('.form-group').next().find('input, select, textarea').first();
                nextInput.focus();

                // Fill form data from the retrieved record
                var data = JSON.parse(resJsonObj.data).record;
                $('#studName').val(data.studName);
                $('#studClass').val(data.studClass);
                $('#birthDate').val(data.birthDate);
                $('#address').val(data.address);
                $('#enrollmentDate').val(data.enrollmentDate);
            }
        }

        function saveStud() {
            var jsonStrObj = validateData();
            if (jsonStrObj === '') return '';

            var putRequest = createPutRequest(connToken, jsonStrObj, studDbName, studRelName);
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIml);
            jQuery.ajaxSetup({ async: true });
            resetStudForm();
        }

        function updateStud() {
            var jsonChg = validateData();
            var updateRequest = createUpdateRecordRequest(connToken, jsonChg, studDbName, studRelName, $('#' + primaryKeyName).val());
            jQuery.ajaxSetup({ async: false });
            var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIml);
            jQuery.ajaxSetup({ async: true });
            resetStudForm();
        }

        function resetStud() {
            resetStudForm();
        }

function validateData() {

    var studid, studname, studclass, addr, dob, enrollment;
    studid = $('#studId').val();
    studname = $('#studName').val();
    studclass = $('#studClass').val();
    dob = $('#birthDate').val();
    addr = $('#address').val();
    enrollment = $('#enrollmentDate').val();

    if (studid === '') {
        alert('Student Roll no. is missing');
        $('#studId').focus();
        return '';
    }
    if (studname === '') {
        alert('Student name is missing');
        $('#studName').focus();
        return '';
    }
    if (studclass === '') {
        alert('Student class is missing');
        $('#studClass').focus();
        return '';
    }
    if (addr === '') {
        alert('Address is missing');
        $('#address').focus();
        return '';
    }
    if (dob === '') {
        alert('DOB is missing');
        $('#birthDate').focus();
        return '';
    }
    if (enrollment === '') {
        alert('Enrollment date is missing');
        $('#enrollmentDate').focus();
        return '';
    }

    var jsonStrObj = {
        id: studid,
        name: studname,
        Class: studclass,
        DOB: dob,
        Address: addr,
        Enrollment_Date: enrollment
    };
    return JSON.stringify(jsonStrObj);
    }