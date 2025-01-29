# Hexagonal architecture eleven labs example

This repo is an example one for hexagonal architecture using the elevenlabs API to convert article content to TTS

## Ports

**Driving ports**

- for generating tts audio
- for updating dictionaries

**Driver ports**

- for generating audio
- for fetching articles
- for updating dictionaries
- for saving files

## Driving adapters

This project can be deployed in 2 ways; as a lambda but also as a CLI.
