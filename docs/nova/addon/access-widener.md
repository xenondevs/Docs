Access wideners allow you to loosen the access limits of classes, methods, and fields.
Currently, access wideners can only be used on classes from NMS or craftbukkit. To use access wideners in your addon, create a file called `<addon_id>.accesswidener` in `src/main/resources`.

After adding entries to your access widener file run IntelliJ's gradle sync (or `_oriInstallJar` if it doesn't work, or `_oriInstall` to also generate sources) to apply them to your compile-time classpath.

## File format

The file must start with the following line:
```
accessWidener v2 named
```

##### Comments

```
# Comments like this are supported, as well as at the end of the line
```

Then, each line that isn't blank or a comment is an instruction to widen the access of a class, method, or field:

##### Classes

```
<access> class <class name>
```

- `access`: either `accessible` or `extendable`
    - `accessible` (make public)
    - `extendable` (make public and remove final)
- `class name`: fully qualified internal name of the class, i.e. using `/` instead of `.` and `$` for inner classes

##### Methods

```
<access> method <class name> <method name> <method descriptor>
```

- `access`: either `accessible` or `extendable`
    - `accessible` (make public and final if private)
    - `extendable` (make protected and remove final, also make class extendable)
- `class name` fully qualified internal name of the owner class, i.e. using `/` instead of `.` and `$` for inner classes
- `method name`: name of the method
- `method descriptor`: the [method descriptor](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.3)

##### Fields

```
<access> field <class name> <field name> <field descriptor>
```

- `access`: either `accessible` or `mutable`
    - `accessible` (make public)
    - `mutable` (remove final)
- `class name` fully qualified internal name of the owner class, i.e. using `/` instead of `.` and `$` for inner classes
- `field name`: name of the field
- `field descriptor`: the [field descriptor](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3.2)