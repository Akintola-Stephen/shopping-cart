Imports Microsoft.VisualBasic
Imports System.Security.Cryptography
Imports System.IO
Imports System.Data
Imports System.Data.SqlClient

Public Class BLL
    ' define the triple des provider
    Private m_des As New TripleDESCryptoServiceProvider

    ' define the string handler
    Private m_utf8 As New UTF8Encoding

    ' define the local property arrays
    Private m_key() As Byte
    Private m_iv() As Byte

    Public Sub New()
        Me.m_key = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24}
        Me.m_iv = {8, 7, 6, 5, 4, 3, 2, 1}
    End Sub

    ' Public Shared Sub WriteLog(ByVal msg As String)
    '     If msg.ToString.Contains("Thread was being aborted") Then
    '     Else
    '         Dim context As HttpContext = HttpContext.Current

    '         Dim _path As String
    '         _path = "~/errorlog.txt"
    '         Dim path As String = context.Server.MapPath(_path)
    '         Dim writer As New System.IO.StreamWriter(path, True)
    '         writer.WriteLine(msg & " | " & "|" & Now())
    '         writer.Close()
    '     End If

    ' End Sub
    ' Public Shared Sub writeLog(ByVal msg As String, Optional ByVal session As String = Nothing)
    '     If msg.ToString.Contains("Thread was being aborted") Then
    '         'do nothing
    '     Else
    '         Dim context As HttpContext = HttpContext.Current
    '         Dim path As String = "~/ErrorLog.txt"
    '         Dim currentPath As String = context.Server.MapPath(path)
    '         Using writer As System.IO.StreamWriter = New System.IO.StreamWriter(currentPath, True)
    '             writer.WriteLine(msg & " | " & Now())
    '             writer.Close()
    '         End Using
    '     End If
    ' End Sub

    Public Shared Sub writeLog(ByVal msg As String)
        Dim context As HttpContext = HttpContext.Current
        'Dim path As String = "~/LOG/Log.txt"
        'Dim currentPath As String = System.Environment.CurrentDirectory + path
        'Dim writer As New System.IO.StreamWriter(currentPath, True)
        Dim path = System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath & "LOG/Log.txt"
        Dim writer As New System.IO.StreamWriter(path, True)
        writer.WriteLine(msg & " | " & Now())
        writer.Close()
    End Sub
    


    Public Function Encrypt(ByVal input() As Byte) As Byte()
        Return Transform(input, m_des.CreateEncryptor(m_key, m_iv))
    End Function

    Public Function Decrypt(ByVal input() As Byte) As Byte()
        Return Transform(input, m_des.CreateDecryptor(m_key, m_iv))
    End Function

    Public Function Encrypt(ByVal text As String) As String
        Dim input() As Byte = m_utf8.GetBytes(text)
        Dim output() As Byte = Transform(input, _
                        m_des.CreateEncryptor(m_key, m_iv))
        Return Convert.ToBase64String(output)
    End Function

    Public Function Decrypt(ByVal text As String) As String
        Dim input() As Byte = Convert.FromBase64String(text)
        Dim output() As Byte = Transform(input, _
                         m_des.CreateDecryptor(m_key, m_iv))
        Return m_utf8.GetString(output)
    End Function

    Private Function Transform(ByVal input() As Byte, _
        ByVal CryptoTransform As ICryptoTransform) As Byte()
        ' create the necessary streams
        Dim memStream As MemoryStream = New MemoryStream
        Dim cryptStream As CryptoStream = New  _
            CryptoStream(memStream, CryptoTransform, _
            CryptoStreamMode.Write)
        ' transform the bytes as requested
        cryptStream.Write(input, 0, input.Length)
        cryptStream.FlushFinalBlock()
        ' Read the memory stream and convert it back into byte array
        memStream.Position = 0
        Dim result(CType(memStream.Length - 1, System.Int32)) As Byte
        memStream.Read(result, 0, CType(result.Length, System.Int32))
        ' close and release the streams
        memStream.Close()
        cryptStream.Close()
        ' hand back the encrypted buffer
        Return result
    End Function
    Public Function MD5_Pwd(ByVal originalPassword As String) As String

        Dim originalBytes As Byte()
        Dim encodedBytes As Byte()
        Dim md5 As MD5

        'Instantiate MD5CryptoServiceProvider, get bytes for original password and compute hash (encoded password)
        md5 = New MD5CryptoServiceProvider()
        originalBytes = ASCIIEncoding.Default.GetBytes(originalPassword)
        encodedBytes = md5.ComputeHash(originalBytes)

        'Convert encoded bytes back to a 'readable' string
        Return BitConverter.ToString(encodedBytes)

    End Function
    Public Shared Function ReturnValueFromCommaArrayByIndex(ByVal TheArray As String, ByVal TheIndex As Integer)
        If TheArray = "" Then
            Return ""
        Else
            Dim MyString As String = TheArray
            Dim MyArray() As String
            MyArray = MyString.Split(",")
            Try
                If MyArray(TheIndex - 1) Is Nothing Then
                    Return ""
                Else
                    Return MyArray(TheIndex - 1)
                End If
            Catch ex As Exception
                Return ""
            End Try

        End If
    End Function
    Public Shared Function ReturnValueFromDashArrayByIndex(ByVal TheArray As String, ByVal TheIndex As Integer)
        If TheArray = "" Or TheArray = "0" Then
            Return DBNull.Value
        Else
            Dim MyString As String = TheArray
            Dim MyArray As String()
            MyArray = MyString.Split("-")
            Return MyArray(TheIndex - 1)
        End If
    End Function
    Public Shared Function CheckPrintURL(ByVal ReportName As String, ByVal TheID As String) As String
        If TheID <> "" Then
            If TheID <> "-" Then
                If TheID <> "0" Then
                    Select Case ReportName.ToUpper
                        'CASH & BANK

                        Case "PETTY CASH"
                            Return "var ScreenWidth=window.screen.width;" & "var ScreenHeight=window.screen.height;" & "var movefromedge=0;" & "placementx=(ScreenWidth/2)-((715)/2);" & "placementy=(ScreenHeight/2)-((700+50)/2);" & "window.open('././APP_DrillDown/PAY_PettyCash.aspx?ID=" & TheID & "','_blank','toolbar=no,resizable=0,width=620,height=700,scrollbars=yes')"

                    End Select
                End If
            End If
        End If
    End Function
    Public Shared Function ConvertNullToZero(ByVal Value)
        If Value Is String.Empty Then
            Return 0.0
        ElseIf Value Is DBNull.Value Then
            Return 0.0
        Else
            Return Value
        End If
    End Function
    Public Shared Function PrintTimeCreated(ByVal DateCreated As String) As String

        Dim ReturnDate As String
        ReturnDate = DateCreated

        If ReturnDate <> "" Then
            ReturnDate = Format(CDate(DateCreated), "hh:mm:ss tt").ToUpper
            If ReturnDate = "12:00:00 AM" Or ReturnDate = "01/01/0001" Then
                Return "-"
            Else
                Return ReturnDate
            End If
            Return ReturnDate
        Else
            Return "-"
        End If

        Return ReturnDate

    End Function
    Public Shared Function PrintDateCreated(ByVal DateCreated As String) As String
        Dim ReturnDate As String
        ReturnDate = DateCreated

        If ReturnDate <> "" Then
            ReturnDate = Format(CDate(DateCreated), "dd/MM/yyyy")
            If ReturnDate = "12:00:00 AM" Or ReturnDate = "01/01/0001" Then
                Return "-"
            Else
                Return ReturnDate
            End If
        Else
            Return "-"
        End If
        Return ReturnDate

    End Function
End Class

