# Hexagonal architecture eleven labs example

This repo is an example one for hexagonal architecture using the elevenlabs API to convert article content to TTS. It was inspired by a [talk from Alistair Cockburn](https://www.youtube.com/watch?v=k0ykTxw7s0Y)

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
