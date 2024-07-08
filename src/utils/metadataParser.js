export function parseMetadata(metadata) {
  if (Array.isArray(metadata)) {
    return metadata.map(item => {
      if (Array.isArray(item) && item.length === 2) {
        const [key, value] = item;
        return { key, value: parseMetadata(value) };
      } else if (typeof item === 'object' && 'key' in item && 'value' in item) {
        return { key: item.key, value: parseMetadata(item.value) };
      } else {
        console.warn('Unexpected array format:', item);
        return item;
      }
    });
  } else if (typeof metadata === 'object' && metadata !== null) {
    if ('Nat' in metadata) return metadata.Nat.toString();
    if ('Int' in metadata) return metadata.Int.toString();
    if ('Text' in metadata) return metadata.Text;
    if ('Blob' in metadata) return new TextDecoder().decode(new Uint8Array(metadata.Blob));
    if ('MetadataArray' in metadata) return parseMetadata(metadata.MetadataArray);

    const parsedObject = {};
    for (const [key, value] of Object.entries(metadata)) {
      parsedObject[key] = parseMetadata(value);
    }
    return parsedObject;
  } else if (typeof metadata === 'bigint') {
    return metadata.toString();
  } else if (typeof metadata === 'string' || typeof metadata === 'number') {
    return metadata;
  } else {
    console.warn('Unexpected metadata format:', metadata);
  }
  return metadata;
}
