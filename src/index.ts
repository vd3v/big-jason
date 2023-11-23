const APP_SERIALISED_BIGINT_PREFIX = 'APP_SERIALISED_BIGINT::';
const APP_SERIALISED_SPECIAL_CHAR_PREFIX = 'APP_SERIALISED_SPECIAL_CHAR::';

const isAppSerialisedBigInt = (str: string | unknown) => {
    if (typeof str !== 'string') {
        return false;
    }
    return str.startsWith(APP_SERIALISED_BIGINT_PREFIX);
};

const serialiseJsonStrings = (jsonString: string): string => {
    // This method is needed to avoid handling bigints inside strings that match JSON syntax patterns (see JSON_STRING_INJECTION in the unit test)
    const stringPattern = /"((?:\\"|[^"])*)"/g;
    const result = jsonString.replace(stringPattern, function (match, p1) {
        const replaced = p1.replace(/([:{}[\]\\])/g, APP_SERIALISED_SPECIAL_CHAR_PREFIX + '$1');
        return '"' + replaced + '"';
    });
    return result;
};

const deserialiseJsonStrings = (serialisedJsonString: string): string => {
    return serialisedJsonString.replace(new RegExp(APP_SERIALISED_SPECIAL_CHAR_PREFIX, 'g'), '');
};

const stringifyBigNumbers = (json: string): string => {
    return deserialiseJsonStrings(
        serialiseJsonStrings(json)
            // This is used to match and replace any large numbers found in objects (a value coming right after a colon).
            .replace(/(?<!:):\s*(-?\d{16,})\s*([,}\]])/g, function (_, p1, p2) {
                return `: "${APP_SERIALISED_BIGINT_PREFIX}${p1.trim()}"${p2}`;
            })

            // This is used to match and replace any large numbers found directly in arrays.
            .replace(/(?<!:):\s*\[(-?\d{16,}(,\s*-?\d{16,})*)\]/g, function (_, p1) {
                const arr = p1.split(',').map((val: string) => {
                    return val.length > 15 ? `"${APP_SERIALISED_BIGINT_PREFIX}${val.trim()}"` : val;
                });
                return `: [${arr.join(',')}]`;
            })
    );
};

const parseWithBigInt = (jsonString: string) => {
    const convertedJsonString = stringifyBigNumbers(jsonString);

    return JSON.parse(convertedJsonString, (key, value) => {
        if (isAppSerialisedBigInt(value)) {
            return BigInt(value.replace(APP_SERIALISED_BIGINT_PREFIX, '').trim());
        } else {
            return value;
        }
    });
};

/*
  Modified JSON parser and stringifier with support for big numbers
*/

const parse = (jsonString: string) => {
    try {
        if(typeof jsonString !== 'string') {
            throw new Error('invalid JSON, expected string but got ' + typeof jsonString);
        }
        if (!jsonString || !jsonString.trim()) {
            throw new Error('empty JSON');
        }
        return parseWithBigInt(jsonString);
    } catch (error) {
        throw new Error('big-jason: parsing error: ' + error);
    }
};

const stringify = (serializableObject: unknown) => JSON.stringify(serializableObject, (key, value) =>
    typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
);

export const BigJason = {
    parse, stringify
};
