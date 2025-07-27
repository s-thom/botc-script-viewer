# Number Store v1

Number Store (name pending) is a format for compressing Blood on the Clocktower scripts. I do not expect anyone else to actually implement this in any way, but I felt like coming up with a format so here it is. I know it's not fit for all circumstances, and is far worse than plain JSON for completely homebrew scripts. However for scripts that use existing characters and don't affect night order, this format can produce much shorter representations.

The name "Number Store" comes from a recurring bit on the [Grim Scenarios Twitch channel](https://www.twitch.tv/grimscenarios). It's also relevant because all of the official characters are *store*d as *number*s.

## Summary

For the most part, Number Store is a mapping of official characters to numbers, then just concatenating those numbers in a binary array.

For example:

```txt
["washerwoman", "librarian", "investigator"]
// becomes...
// Uint8Array[0x1, 0x2, 0x3]
//              ^    ^    ^- ID of Investigator
//              |    └- ID of Librarian
//              └- ID of Washerwoman
```

The complication comes in with custom characters and the script metadata. These are arbitrary JSON, which poses a problem for this scheme. The (probably bad) solution I've come up with is based on [Type-Length-Value](https://en.wikipedia.org/wiki/Type%E2%80%93length%E2%80%93value) (TLV) protocols, which provide a forwards-compatible way of representing

In this case, since character descriptions can take up space, I've decided to go with a 2 byte `length` field, allowing for values from 0 to 65536 bytes (64KiB) long. For context, the entire Fall of Rome (a popular homebrew) script is 17KiB.

The length field is stored Big-endian. i.e. `0x12 0x34` should be `4660` (`0x1234`) and not `13330` (`0x3412`).

```txt
bit
0       8       16      24      ...
+-------+-------+-------+----------------
| type  | length (2byt) | value (length)
+-------+-------+-------+----------------
```

In this version, there are only three places where the TLV is used:

1. Script metadata (type = `0x0`)
2. Encapsulating fields within the script metadata (many types, will be explained)
3. Arbitrary JSON (type = `0xFF`)

The remaining 253 possible type values are either assigned to characters directly, or reserved for future characters. As of 2025-07-26, there are officially released 177 characters in Blood on the Clocktower.

## Standard Characters

Standard characters are not encoded using the Type-Length-Value scheme, and are instead direct mappings from character type to a number. The numbering starts at `0x1` to leave space for the script metadata at `0x0`.

The exact mapping of characters is as follows:

<details>
<summary>Mapping scheme definition</summary>

- Characters from Trouble Brewing (minus recommended travellers) in script order.
- Characters from Sects and Violets (minus recommended travellers) in script order.
- Characters from Bad Moon Rising (minus recommended travellers) in script order.
- Base travellers and fabled
  - Travellers released in the Travellers & Fabled pack in alphabetical order.
  - Fabled released in the Travellers & Fabled pack in alphabetical order.
- The Carousel
  - Townsfolk in alphabetical order.
  - Outsiders in alphabetical order.
  - Minions in alphabetical order.
  - Demons in alphabetical order.
  - Travellers in alphabetical order.
  - Fabled in alphabetical order.
- Any future released characters, in order of release.

</details>

<details>
<summary>Mapping as a table</summary>

| Character name   | Id             | Value  |
| ---------------- | -------------- | ------ |
| Washerwoman      | washerwoman    | `0x01` |
| Librarian        | librarian      | `0x02` |
| Investigator     | investigator   | `0x03` |
| Chef             | chef           | `0x04` |
| Empath           | empath         | `0x05` |
| Fortune Teller   | fortuneteller  | `0x06` |
| Undertaker       | undertaker     | `0x07` |
| Monk             | monk           | `0x08` |
| Ravenkeeper      | ravenkeeper    | `0x09` |
| Virgin           | virgin         | `0x0a` |
| Slayer           | slayer         | `0x0b` |
| Soldier          | soldier        | `0x0c` |
| Mayor            | mayor          | `0x0d` |
| Butler           | butler         | `0x0e` |
| Drunk            | drunk          | `0x0f` |
| Recluse          | recluse        | `0x10` |
| Saint            | saint          | `0x11` |
| Poisoner         | poisoner       | `0x12` |
| Spy              | spy            | `0x13` |
| Scarlet Woman    | scarletwoman   | `0x14` |
| Baron            | baron          | `0x15` |
| Imp              | imp            | `0x16` |
| Clockmaker       | clockmaker     | `0x17` |
| Dreamer          | dreamer        | `0x18` |
| Snake Charmer    | snakecharmer   | `0x19` |
| Mathematician    | mathematician  | `0x1a` |
| Flowergirl       | flowergirl     | `0x1b` |
| Town Crier       | towncrier      | `0x1c` |
| Oracle           | oracle         | `0x1d` |
| Savant           | savant         | `0x1e` |
| Seamstress       | seamstress     | `0x1f` |
| Philosopher      | philosopher    | `0x20` |
| Artist           | artist         | `0x21` |
| Juggler          | juggler        | `0x22` |
| Sage             | sage           | `0x23` |
| Mutant           | mutant         | `0x24` |
| Sweetheart       | sweetheart     | `0x25` |
| Barber           | barber         | `0x26` |
| Klutz            | klutz          | `0x27` |
| Evil Twin        | eviltwin       | `0x28` |
| Witch            | witch          | `0x29` |
| Cerenovus        | cerenovus      | `0x2a` |
| Pit-Hag          | pithag         | `0x2b` |
| Fang Gu          | fanggu         | `0x2c` |
| Vigormortis      | vigormortis    | `0x2d` |
| No Dashii        | nodashii       | `0x2e` |
| Vortox           | vortox         | `0x2f` |
| Grandmother      | grandmother    | `0x30` |
| Sailor           | sailor         | `0x31` |
| Chambermaid      | chambermaid    | `0x32` |
| Exorcist         | exorcist       | `0x33` |
| Innkeeper        | innkeeper      | `0x34` |
| Gambler          | gambler        | `0x35` |
| Gossip           | gossip         | `0x36` |
| Courtier         | courtier       | `0x37` |
| Professor        | professor      | `0x38` |
| Minstrel         | minstrel       | `0x39` |
| Tea Lady         | tealady        | `0x3a` |
| Pacifist         | pacifist       | `0x3b` |
| Fool             | fool           | `0x3c` |
| Tinker           | tinker         | `0x3d` |
| Moonchild        | moonchild      | `0x3e` |
| Goon             | goon           | `0x3f` |
| Lunatic          | lunatic        | `0x40` |
| Godfather        | godfather      | `0x41` |
| Devil's Advocate | devilsadvocate | `0x42` |
| Assassin         | assassin       | `0x43` |
| Mastermind       | mastermind     | `0x44` |
| Zombuul          | zombuul        | `0x45` |
| Pukka            | pukka          | `0x46` |
| Shabaloth        | shabaloth      | `0x47` |
| Po               | po             | `0x48` |
| Apprentice       | apprentice     | `0x49` |
| Barista          | barista        | `0x4a` |
| Bureaucrat       | bureaucrat     | `0x4b` |
| Beggar           | beggar         | `0x4c` |
| Bishop           | bishop         | `0x4d` |
| Bone Collector   | bonecollector  | `0x4e` |
| Butcher          | butcher        | `0x4f` |
| Deviant          | deviant        | `0x50` |
| Gunslinger       | gunslinger     | `0x51` |
| Harlot           | harlot         | `0x52` |
| Judge            | judge          | `0x53` |
| Matron           | matron         | `0x54` |
| Scapegoat        | scapegoat      | `0x55` |
| Thief            | thief          | `0x56` |
| Voudon           | voudon         | `0x57` |
| Angel            | angel          | `0x58` |
| Buddhist         | buddhist       | `0x59` |
| Djinn            | djinn          | `0x5a` |
| Doomsayer        | doomsayer      | `0x5b` |
| Duchess          | duchess        | `0x5c` |
| Fibbin           | fibbin         | `0x5d` |
| Fiddler          | fiddler        | `0x5e` |
| Hell's Librarian | hellslibrarian | `0x5f` |
| Revolutionary    | revolutionary  | `0x60` |
| Sentinel         | sentinel       | `0x61` |
| Spirit of Ivory  | spiritofivory  | `0x62` |
| Toymaker         | toymaker       | `0x63` |
| Acrobat          | acrobat        | `0x64` |
| Alchemist        | alchemist      | `0x65` |
| Alsaahir         | alsaahir       | `0x66` |
| Amnesiac         | amnesiac       | `0x67` |
| Atheist          | atheist        | `0x68` |
| Balloonist       | balloonist     | `0x69` |
| Banshee          | banshee        | `0x6a` |
| Bounty Hunter    | bountyhunter   | `0x6b` |
| Cannibal         | cannibal       | `0x6c` |
| Choirboy         | choirboy       | `0x6d` |
| Cult Leader      | cultleader     | `0x6e` |
| Engineer         | engineer       | `0x6f` |
| Farmer           | farmer         | `0x70` |
| Fisherman        | fisherman      | `0x71` |
| General          | general        | `0x72` |
| High Priestess   | highpriestess  | `0x73` |
| Huntsman         | huntsman       | `0x74` |
| King             | king           | `0x75` |
| Knight           | knight         | `0x76` |
| Lycanthrope      | lycanthrope    | `0x77` |
| Magician         | magician       | `0x78` |
| Nightwatchman    | nightwatchman  | `0x79` |
| Noble            | noble          | `0x7a` |
| Pixie            | pixie          | `0x7b` |
| Poppy Grower     | poppygrower    | `0x7c` |
| Preacher         | preacher       | `0x7d` |
| Princess         | princess       | `0x7e` |
| Shugenja         | shugenja       | `0x7f` |
| Steward          | steward        | `0x80` |
| Village Idiot    | villageidiot   | `0x81` |
| Damsel           | damsel         | `0x82` |
| Golem            | golem          | `0x83` |
| Hatter           | hatter         | `0x84` |
| Heretic          | heretic        | `0x85` |
| Hermit           | hermit         | `0x86` |
| Ogre             | ogre           | `0x87` |
| Plague Doctor    | plaguedoctor   | `0x88` |
| Politician       | politician     | `0x89` |
| Puzzlemaster     | puzzlemaster   | `0x8a` |
| Snitch           | snitch         | `0x8b` |
| Zealot           | zealot         | `0x8c` |
| Boffin           | boffin         | `0x8d` |
| Boomdandy        | boomdandy      | `0x8e` |
| Fearmonger       | fearmonger     | `0x8f` |
| Goblin           | goblin         | `0x90` |
| Harpy            | harpy          | `0x91` |
| Marionette       | marionette     | `0x92` |
| Mezepheles       | mezepheles     | `0x93` |
| Organ Grinder    | organgrinder   | `0x94` |
| Psychopath       | psychopath     | `0x95` |
| Summoner         | summoner       | `0x96` |
| Vizier           | vizier         | `0x97` |
| Widow            | widow          | `0x98` |
| Wizard           | wizard         | `0x99` |
| Wraith           | wraith         | `0x9a` |
| Xaan             | xaan           | `0x9b` |
| Al-Hadikhia      | alhadikhia     | `0x9c` |
| Kazali           | kazali         | `0x9d` |
| Legion           | legion         | `0x9e` |
| Leviathan        | leviathan      | `0x9f` |
| Lil' Monsta      | lilmonsta      | `0xa0` |
| Lleech           | lleech         | `0xa1` |
| Lord of Typhon   | lordoftyphon   | `0xa2` |
| Ojo              | ojo            | `0xa3` |
| Riot             | riot           | `0xa4` |
| Yaggababble      | yaggababble    | `0xa5` |
| Cacklejack       | cacklejack     | `0xa6` |
| Gangster         | gangster       | `0xa7` |
| Gnome            | gnome          | `0xa8` |
| Bootlegger       | bootlegger     | `0xa9` |
| Deus ex Fiasco   | deusexfiasco   | `0xaa` |
| Ferryman         | ferryman       | `0xab` |
| Gardener         | gardener       | `0xac` |
| Storm Catcher    | stormcatcher   | `0xad` |

</details>

Any future released characters will be added by announcement date. If multiple characters are release at the same time, then they will be sorted by character type and then alphabetically.

## Arbitrary JSON values

Scripts sometimes contain homebrewed characters. By allowing arbitrary JSON values, this format can support all features of regular JSON scripts by default.

| Name | Type  | Length    | Value                             |
| ---- | ----- | --------- | --------------------------------- |
| JSON | `255` | 0 - 65535 | A JSON string encoded using UTF-8 |

```txt
[/* ... */, {"id":"spartacusfallofromerh","name":"Spartacus", /* ... */ }, /* ... */]
// becomes...
// Uint8Array[..., 0xFF, 0x01, 0x56, 0x7B, 0x22, 0x69, ...]
//                   ^     ^     ^     ^-----┴-----┴- JSON string
//                   |     └-----┴- 342 in HEX, length of character JSON object
//                   └- 255, type for JSON
```

## Script Metadata

The script metadata is perhaps the most complicated part of this specification, as it involves nesting a separate Type-Length-Value scheme within this value.

| Name     | Type | Length    | Value                                          |
| -------- | ---- | --------- | ---------------------------------------------- |
| Metadata | `0`  | 0 - 65535 | A separate TLV encoded list (documented below) |

### Script Metadata fields

Each of the fields in the script metadata are well-known, and therefore we can use Type-Length-Value properly.

If an unknown field type is encountered, it must be skipped over. All defined fields are optional.

| Name        | Type | Length    | Value                                           |
| ----------- | ---- | --------- | ----------------------------------------------- |
| Name        | `0`  | 0 - 65535 | UTF-8 encoded string.                           |
| Author      | `1`  | 0 - 65535 | UTF-8 encoded string.                           |
| Hide title  | `2`  | 1         | `0x0` (false) or `0x1` (true).                  |
| Logo        | `3`  | 0 - 65535 | UTF-8 encoded string (URL).                     |
| Background  | `4`  | 0 - 65535 | UTF-8 encoded string (URL).                     |
| Almanac     | `5`  | 0 - 65535 | UTF-8 encoded string (URL).                     |
| Bootlegger  | `6`  | 0 - 65535 | UTF-8 encoded string. May occur multiple times. |
| First Night | `7`  | 0 - 65535 | Byte array. See below.                          |
| Other Night | `8`  | 0 - 65535 | Byte array. See below.                          |

#### Night order

This is where the format falls apart, because not only is there nested TLV, but there's another layer of encoding inside the nested TLV.

The night order values should be interpreted similarly to the outer list, in that it's a mix of raw byte values and TLV encoded values.

- `0x00` is invalid and should be ignored. If present, treat as a TLV value.
- Bytes values from `0x1` to `0xFE` should be interpreted as the same characters from the Standard Characters section of the specification.
- A byte value of `0xFF` indicates the start of a TLV-wrapped string, to allow for homebrew character names to appear in the list.

```txt
{ /* ... */, firstNight: ["washerwoman", "spartacusfallofromerh"] }
// becomes...
// Uint8Array[..., 0x01, 0xFF, 0x00, 0x15, 0x73, 0x70, 0x61, ...]
//                   ^     ^     ^     ^     ^-----┴-----┴- "spa..."
//                   |     |     └-----┴- 21 in Hex, length of the string "spartacusfallofromerh"
//                   |     └- 255, type for string values
//                   └- ID of Washerwoman
```

## Optional implementation behaviours

The following behaviours are things that implementations may or may not do during serialisation. A consequence of these is that scripts might not be identical after being round-tripped.

- Not serialise characters that can be inferred from other places in the script.
  - This is most obvious with the Bootlegger and Djinn fabled.
    - The Bootlegger is automatically added if the script contains bootlegger rules or homebrew characters.
    - Th Djinn is automatically added if the script has any active jinxes between characters.
  - Implementations may or may not include these in serialised or deserialised output.

## FAQ & Limitations

The A in "FAQ" stands for "Anticipated".

### Why not just use JSON?

I'm making a website where the entire content of the script is shoved into the URL so I don't have to store anything on the server. Script JSON files can get large, even when gzipped.

The Number Store format is intended to reduce the length of the URL for scripts with mostly official characters. For fully homebrew scripts or scripts with complex metadata, JSON is likely a better choice as there isn't the 3-byte overhead for every custom part.

### Can this format represent every possible script?

The answer is yes, as it can handle arbitrary JSON objects...

...but should it? Absolutely not. Large numbers of JSON blocks make the format less efficient, so it performs better on scripts containing only official characters. Luckily, this is most scripts.

### What are the main trade-offs of the format?

- It's not really suitable for scripts with many homebrew characters.
- Having nested TLV fields is confusing and error-prone.
- Any future character additions require updating the mapping, or at least defining exactly how future characters will be added.
- Binary format is less human-readable than JSON.

### Is this format stable?

Kinda? The mapping and specification may change as new characters are released or requirements change. This is a v1, if there are any breaking changes then there will be a v2.

### Can I use this for my own projects?

You can, but you might want to evaluate your requirements before you do. If you do choose to use it, reach out and let me know. I'll either help you or tell you it's a terrible idea and you should stay away as far as possible. I don't know which at this stage.

### How do I handle unknown or reserved type values?

If you encounter an unknown type, just skip it. Reserved types/values may be used for future released characters/features.
