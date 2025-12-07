#!/usr/bin/env python3
import sys, json

def main():
    data = json.load(sys.stdin)
    name = data.get('name', 'world')
    result = {"message": f"Hello, {name}!", "echo": data}
    print(json.dumps(result))

if __name__ == '__main__':
    main()
