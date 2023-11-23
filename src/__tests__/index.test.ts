import { BigIntJSON } from '../index';

describe('BigIntJSON', () => {
  describe('parse', () => {
    test('simple JSON', () => {
      const parsedObject = BigIntJSON.parse('{"a_number": 1, "b_number": 2, "c_bigint": 123456789012345678999 }');
      expect(parsedObject).toEqual({
        a_number: 1,
        b_number: 2,
        c_bigint: BigInt('123456789012345678999'),
      });
    });

    test('JSON with big numbers in arrays', () => {
      const parsedObject = BigIntJSON.parse('{"a_number": 1, "b_number": 2, "c_bigint": [123456789012345678999, 123456789012345678999] }');
      expect(parsedObject).toEqual({
        a_number: 1,
        b_number: 2,
        c_bigint: [BigInt('123456789012345678999'), BigInt('123456789012345678999')],
      });
    });

    test('JSON with big numbers in objects', () => {
      const parsedObject = BigIntJSON.parse('{"a_number": 1, "b_number": 2, "c_bigint": { "d_bigint": 123456789012345678999 } }');
      expect(parsedObject).toEqual({
        a_number: 1,
        b_number: 2,
        c_bigint: { d_bigint: BigInt('123456789012345678999') },
      });
    });

    test('JSON with big numbers in a string', () => {
      const parsedObject = BigIntJSON.parse('{"a_number": 1, "b_number": 2, "fake_bigints_string": "123456789123456789,1234567891234567891,1234567891234567892,1234567891234567893" }');
      expect(parsedObject).toEqual({
        a_number: 1,
        b_number: 2,
        fake_bigints_string: '123456789123456789,1234567891234567891,1234567891234567892,1234567891234567893',
      });
    });

    test('JSON_STRING_INJECTION test', () => {
      const parsedObject = BigIntJSON.parse(`{
        "A": 123123,
        "B": "123123",
        "C": "C111",
        "LONG_NUMBER_VALUE": 895639083512890235980325443,
        "LONG_NUMBER_AS_A_STRING" : "8908962355232352535231234",
        "LONG_NUMBER_INSIDE_A_STRING": "SOME_98075178951289751238901245_TEXT",
        "array_with_bigints": [8908962355232352535231234, 895639083512890235980325443],
        "array_with_numbers": [123,456],
        "123789654679812457681246789124": {
          "123789654679812457681246789124": "Micky Mouse",
          "array_example": [1, 2, 3, 4, 5],
          "array_with_bigints": [123456789012345678901234567890, 123456789012345678901234567890]
        },
        "deeply_nested": {
          "second_level": {
            "third_level": {
              "value": 890245398052318902532809,
              "object_in_array": [{ "value": 890245398052318902532809, "JSON_STRING_INJECTION": "LOREM: { IPSUM: 437189478931873419879234 }" }],
              "another_value": "123456789012345678901234567890"
            }
          }
        }
       }`);

      expect(parsedObject).toEqual({
        A: 123123,
        B: "123123",
        C: "C111",
        LONG_NUMBER_VALUE: BigInt("895639083512890235980325443"), // becomes a BigInt, while the rest of the values remain unchanged
        LONG_NUMBER_AS_A_STRING: "8908962355232352535231234",
        LONG_NUMBER_INSIDE_A_STRING: "SOME_98075178951289751238901245_TEXT",
        array_with_bigints: [BigInt("8908962355232352535231234"), BigInt("895639083512890235980325443")],
        array_with_numbers: [123, 456],
        "123789654679812457681246789124": {
          "123789654679812457681246789124": "Micky Mouse",
          array_example: [1, 2, 3, 4, 5],
          array_with_bigints: [BigInt("123456789012345678901234567890"), BigInt("123456789012345678901234567890")]
        },
        deeply_nested: {
          second_level: {
            third_level: {
              value: BigInt("890245398052318902532809"),
              object_in_array: [
                {
                  value: BigInt("890245398052318902532809"), // also becomes a BigInt, no matter how deeply is nested
                  JSON_STRING_INJECTION: "LOREM: { IPSUM: 437189478931873419879234 }" // should see no change as it is inside a string
                }
              ],
              another_value: "123456789012345678901234567890"
            }
          }
        }
      });
    });
  });

  describe('strigify', () => {
    test('stringifies bigints correctly', () => {
      const objectToStringify = {
        longNumber: BigInt('123456789012345678901234567890'),
        regularNumber: 123,
        string: 'qwerty',
        boolean: false
      };
  
      expect(BigIntJSON.stringify(objectToStringify)).toEqual('{"longNumber":"123456789012345678901234567890","regularNumber":123,"string":"qwerty","boolean":false}');
    });
  });
});
